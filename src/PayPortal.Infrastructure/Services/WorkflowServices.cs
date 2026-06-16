using Microsoft.EntityFrameworkCore;
using PayPortal.Application.Abstractions;
using PayPortal.Application.Models;
using PayPortal.Domain.Entities;
using PayPortal.Domain.Enums;
using PayPortal.Infrastructure.Persistence;

namespace PayPortal.Infrastructure.Services;

internal sealed class KycService(
    PortalDbContext dbContext,
    IMerchantService merchantService,
    IFileStorage storage,
    ICurrentUser currentUser) : IKycService
{
    private static readonly HashSet<string> AllowedTypes =
        ["application/pdf", "image/png", "image/jpeg"];

    public async Task<KycDocument> UploadAsync(
        Guid merchantId,
        string type,
        string fileName,
        string contentType,
        long size,
        Stream stream,
        CancellationToken cancellationToken = default)
    {
        if (size <= 0 || size > 10 * 1024 * 1024 || !AllowedTypes.Contains(contentType))
        {
            throw new InvalidOperationException("Upload a PDF, PNG, or JPEG file up to 10 MB.");
        }

        _ = await merchantService.GetAccessibleAsync(merchantId, cancellationToken)
            ?? throw new InvalidOperationException("Merchant not found.");

        var extension = contentType switch
        {
            "application/pdf" => ".pdf",
            "image/png" => ".png",
            _ => ".jpg"
        };
        var storageName = await storage.SaveAsync(stream, extension, cancellationToken);
        var document = new KycDocument
        {
            MerchantId = merchantId,
            DocumentType = type,
            DocumentName = Path.GetFileName(fileName),
            StorageName = storageName,
            FileSize = size,
            ContentType = contentType
        };

        dbContext.KycDocuments.Add(document);
        var requiredTypes = new[]
        {
            "business_registration",
            "tax_certificate",
            "id_document"
        };
        var existingTypes = await dbContext.KycDocuments
            .Where(x => x.MerchantId == merchantId)
            .Select(x => x.DocumentType)
            .ToListAsync(cancellationToken);
        existingTypes.Add(type);
        var requiredDocumentsComplete = requiredTypes.All(existingTypes.Contains);
        if (requiredDocumentsComplete)
        {
            await CompleteMilestoneAsync(merchantId, "documents", cancellationToken);
            var merchant = await dbContext.Merchants.SingleAsync(
                x => x.Id == merchantId, cancellationToken);
            if (merchant.Status == MerchantStatus.Pending)
            {
                merchant.Status = MerchantStatus.UnderReview;
                merchant.UpdatedAtUtc = DateTime.UtcNow;
                dbContext.ActivityEntries.Add(new ActivityEntry
                {
                    MerchantId = merchantId,
                    ActorUserId = currentUser.UserId!,
                    Action = "application_ready_for_review",
                    EntityType = nameof(Merchant),
                    EntityId = merchantId.ToString()
                });
            }
        }

        dbContext.ActivityEntries.Add(new ActivityEntry
        {
            MerchantId = merchantId,
            ActorUserId = currentUser.UserId!,
            Action = "document_uploaded",
            EntityType = nameof(KycDocument),
            EntityId = document.Id.ToString(),
            Details = type
        });
        await dbContext.SaveChangesAsync(cancellationToken);
        return document;
    }

    public async Task<StoredFile?> OpenDocumentAsync(
        Guid documentId,
        CancellationToken cancellationToken = default)
    {
        var document = await dbContext.KycDocuments.AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == documentId, cancellationToken);
        if (document is null)
        {
            return null;
        }

        _ = await merchantService.GetAccessibleAsync(document.MerchantId, cancellationToken)
            ?? throw new UnauthorizedAccessException("The document is not accessible.");
        var stream = await storage.OpenReadAsync(document.StorageName, cancellationToken);
        return stream is null
            ? null
            : new StoredFile(stream, document.ContentType, document.DocumentName);
    }

    private async Task CompleteMilestoneAsync(
        Guid merchantId,
        string type,
        CancellationToken cancellationToken)
    {
        var milestone = await dbContext.KycMilestones.SingleOrDefaultAsync(
            x => x.MerchantId == merchantId && x.Type == type, cancellationToken);
        if (milestone is not null && !milestone.IsCompleted)
        {
            milestone.IsCompleted = true;
            milestone.CompletedAtUtc = DateTime.UtcNow;
        }
    }
}

internal sealed class CredentialService(
    PortalDbContext dbContext,
    IMerchantService merchantService,
    ISecretGenerator secretGenerator,
    ICurrentUser currentUser) : ICredentialService
{
    public async Task<IssuedCredential> IssueAsync(
        Guid merchantId,
        string name,
        CredentialEnvironment environment,
        IReadOnlyCollection<string> permissions,
        CancellationToken cancellationToken = default)
    {
        var merchant = await merchantService.GetAccessibleAsync(merchantId, cancellationToken)
            ?? throw new InvalidOperationException("Merchant not found.");
        if (merchant.Status != MerchantStatus.Approved)
        {
            throw new InvalidOperationException("API credentials require an approved merchant.");
        }

        var generated = secretGenerator.Generate(environment.ToString());
        var credential = new ApiCredential
        {
            MerchantId = merchantId,
            Name = name.Trim(),
            PublicKey = generated.PublicKey,
            SecretHash = generated.SecretHash,
            Environment = environment,
            PermissionsCsv = string.Join(',', permissions.Distinct(StringComparer.OrdinalIgnoreCase))
        };
        dbContext.ApiCredentials.Add(credential);
        dbContext.ActivityEntries.Add(Activity(merchantId, "api_credential_issued", credential.Id));
        await dbContext.SaveChangesAsync(cancellationToken);
        return new(credential.Id, credential.Name, credential.PublicKey, generated.Secret, environment);
    }

    public async Task<IssuedCredential> RotateAsync(
        Guid credentialId,
        CancellationToken cancellationToken = default)
    {
        var existing = await dbContext.ApiCredentials.SingleOrDefaultAsync(
            x => x.Id == credentialId, cancellationToken)
            ?? throw new InvalidOperationException("Credential not found.");
        _ = await merchantService.GetAccessibleAsync(existing.MerchantId, cancellationToken);
        existing.RevokedAtUtc = DateTime.UtcNow;
        return await IssueAsync(
            existing.MerchantId,
            $"{existing.Name} (rotated)",
            existing.Environment,
            existing.PermissionsCsv.Split(',', StringSplitOptions.RemoveEmptyEntries),
            cancellationToken);
    }

    private ActivityEntry Activity(Guid merchantId, string action, Guid entityId) => new()
    {
        MerchantId = merchantId,
        ActorUserId = currentUser.UserId!,
        Action = action,
        EntityType = nameof(ApiCredential),
        EntityId = entityId.ToString()
    };
}

internal sealed class ReviewService(
    PortalDbContext dbContext,
    ICurrentUser currentUser) : IReviewService
{
    public async Task ReviewDocumentAsync(
        Guid documentId,
        DocumentReviewRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!currentUser.IsAdmin)
        {
            throw new UnauthorizedAccessException("Administrator access required.");
        }

        if (request.Status is not (DocumentStatus.Verified or DocumentStatus.Rejected))
        {
            throw new InvalidOperationException("Documents can only be verified or rejected by an administrator.");
        }

        if (request.Status == DocumentStatus.Rejected && string.IsNullOrWhiteSpace(request.Notes))
        {
            throw new InvalidOperationException("Rejection notes are required.");
        }

        var document = await dbContext.KycDocuments.SingleOrDefaultAsync(
            x => x.Id == documentId, cancellationToken)
            ?? throw new InvalidOperationException("Document not found.");
        var merchant = await dbContext.Merchants
            .Include(x => x.KycDocuments)
            .SingleAsync(x => x.Id == document.MerchantId, cancellationToken);

        document.Status = request.Status;
        document.ReviewerNotes = Clean(request.Notes);
        document.RejectionReason = request.Status == DocumentStatus.Rejected
            ? request.Notes.Trim()
            : null;
        document.ReviewedAtUtc = DateTime.UtcNow;
        document.ReviewedByUserId = currentUser.UserId;
        merchant.RiskLevel = CalculateRisk(merchant);
        merchant.UpdatedAtUtc = DateTime.UtcNow;

        dbContext.ActivityEntries.Add(new ActivityEntry
        {
            MerchantId = document.MerchantId,
            ActorUserId = currentUser.UserId!,
            Action = request.Status == DocumentStatus.Verified
                ? "kyc_document_verified"
                : "kyc_document_rejected",
            EntityType = nameof(KycDocument),
            EntityId = document.Id.ToString(),
            Details = document.DocumentType
        });
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task AddAdminNoteAsync(
        Guid merchantId,
        string notes,
        CancellationToken cancellationToken = default)
    {
        if (!currentUser.IsAdmin)
        {
            throw new UnauthorizedAccessException("Administrator access required.");
        }

        if (string.IsNullOrWhiteSpace(notes))
        {
            throw new InvalidOperationException("Admin note text is required.");
        }

        _ = await dbContext.Merchants.SingleOrDefaultAsync(
            x => x.Id == merchantId, cancellationToken)
            ?? throw new InvalidOperationException("Merchant not found.");

        dbContext.ApplicationReviews.Add(new ApplicationReview
        {
            MerchantId = merchantId,
            ReviewerUserId = currentUser.UserId!,
            ReviewType = "admin_note",
            Notes = notes.Trim(),
            Decision = ReviewDecision.ComplianceReviewed
        });
        dbContext.ActivityEntries.Add(new ActivityEntry
        {
            MerchantId = merchantId,
            ActorUserId = currentUser.UserId!,
            Action = "admin_note_added",
            EntityType = nameof(ApplicationReview),
            EntityId = merchantId.ToString()
        });
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task CompleteComplianceReviewAsync(
        Guid merchantId,
        string notes,
        CancellationToken cancellationToken = default)
    {
        if (!currentUser.IsAdmin)
        {
            throw new UnauthorizedAccessException("Administrator access required.");
        }

        if (string.IsNullOrWhiteSpace(notes))
        {
            throw new InvalidOperationException("Compliance review notes are required.");
        }

        var merchant = await dbContext.Merchants
            .Include(x => x.KycDocuments)
            .SingleOrDefaultAsync(x => x.Id == merchantId, cancellationToken)
            ?? throw new InvalidOperationException("Merchant not found.");

        var requiredTypes = new[] { "business_registration", "tax_certificate", "id_document" };
        if (!requiredTypes.All(type => merchant.KycDocuments.Any(x => x.DocumentType == type)))
        {
            throw new InvalidOperationException("All required documents must be uploaded before compliance review can be completed.");
        }

        await SetMilestoneAsync(merchantId, "review", true, cancellationToken);
        merchant.Status = MerchantStatus.UnderReview;
        merchant.UpdatedAtUtc = DateTime.UtcNow;

        dbContext.ApplicationReviews.Add(new ApplicationReview
        {
            MerchantId = merchantId,
            ReviewerUserId = currentUser.UserId!,
            ReviewType = "compliance_review",
            Notes = notes.Trim(),
            Decision = ReviewDecision.ComplianceReviewed
        });
        dbContext.ActivityEntries.Add(new ActivityEntry
        {
            MerchantId = merchantId,
            ActorUserId = currentUser.UserId!,
            Action = "compliance_review_completed",
            EntityType = nameof(Merchant),
            EntityId = merchantId.ToString()
        });
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task ReviewAsync(
        Guid merchantId,
        ReviewRequest request,
        CancellationToken cancellationToken = default)
    {
        if (!currentUser.IsAdmin)
        {
            throw new UnauthorizedAccessException("Administrator access required.");
        }

        var merchant = await dbContext.Merchants.SingleOrDefaultAsync(
            x => x.Id == merchantId, cancellationToken)
            ?? throw new InvalidOperationException("Merchant not found.");

        merchant.Status = request.Decision switch
        {
            ReviewDecision.Approved => MerchantStatus.Approved,
            ReviewDecision.Rejected => MerchantStatus.Rejected,
            _ => MerchantStatus.Pending
        };
        merchant.UpdatedAtUtc = DateTime.UtcNow;
        merchant.ApprovedAtUtc = request.Decision == ReviewDecision.Approved
            ? DateTime.UtcNow
            : null;
        merchant.ApprovedByUserId = request.Decision == ReviewDecision.Approved
            ? currentUser.UserId
            : null;
        await SetMilestoneAsync(
            merchantId,
            "review",
            request.Decision is ReviewDecision.Approved or ReviewDecision.Rejected,
            cancellationToken);
        await SetMilestoneAsync(
            merchantId,
            "approval",
            request.Decision == ReviewDecision.Approved,
            cancellationToken);

        if (request.Decision == ReviewDecision.Approved)
        {
            var documents = await dbContext.KycDocuments
                .Where(x => x.MerchantId == merchantId && x.Status == DocumentStatus.Pending)
                .ToListAsync(cancellationToken);
            foreach (var document in documents)
            {
                document.Status = DocumentStatus.Verified;
                document.ReviewerNotes = request.Notes.Trim();
                document.ReviewedAtUtc = DateTime.UtcNow;
                document.ReviewedByUserId = currentUser.UserId;
            }
        }

        dbContext.ApplicationReviews.Add(new ApplicationReview
        {
            MerchantId = merchantId,
            ReviewerUserId = currentUser.UserId!,
            ReviewType = "application_review",
            Notes = request.Notes.Trim(),
            Decision = request.Decision
        });
        dbContext.ActivityEntries.Add(new ActivityEntry
        {
            MerchantId = merchantId,
            ActorUserId = currentUser.UserId!,
            Action = $"application_{request.Decision.ToString().ToLowerInvariant()}",
            EntityType = nameof(Merchant),
            EntityId = merchantId.ToString()
        });
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    private async Task SetMilestoneAsync(
        Guid merchantId,
        string type,
        bool complete,
        CancellationToken cancellationToken)
    {
        var milestone = await dbContext.KycMilestones.SingleOrDefaultAsync(
            x => x.MerchantId == merchantId && x.Type == type, cancellationToken);
        if (milestone is null)
        {
            return;
        }

        milestone.IsCompleted = complete;
        milestone.CompletedAtUtc = complete ? DateTime.UtcNow : null;
    }

    private static string? Clean(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static RiskLevel CalculateRisk(Merchant merchant)
    {
        var score = 0;
        if (string.Equals(merchant.BusinessType, "Corporation", StringComparison.OrdinalIgnoreCase))
        {
            score += 1;
        }

        if (string.Equals(merchant.Industry, "Financial Services", StringComparison.OrdinalIgnoreCase))
        {
            score += 2;
        }

        if (string.Equals(merchant.Industry, "Real Estate", StringComparison.OrdinalIgnoreCase))
        {
            score += 1;
        }

        score += merchant.KycDocuments.Count(x => x.Status == DocumentStatus.Rejected) * 2;
        return score >= 4 ? RiskLevel.High : score >= 2 ? RiskLevel.Medium : RiskLevel.Low;
    }
}
