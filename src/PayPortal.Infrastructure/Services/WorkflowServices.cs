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
}
