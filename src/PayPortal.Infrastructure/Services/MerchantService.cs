using PayPortal.Application.Abstractions;
using PayPortal.Application.Models;
using PayPortal.Domain.Entities;
using PayPortal.Domain.Enums;

namespace PayPortal.Infrastructure.Services;

internal sealed class MerchantService(
    IMerchantRepository merchants,
    IActivityRepository activities,
    ILogoStorage logoStorage,
    ICurrentUser currentUser) : IMerchantService
{
    private static readonly HashSet<string> AllowedLogoTypes =
        ["image/png", "image/jpeg"];

    public async Task<IReadOnlyList<Merchant>> ListAsync(
        string? search,
        MerchantStatus? status,
        RiskLevel? risk,
        string? businessType = null,
        string? industry = null,
        CancellationToken cancellationToken = default)
    {
        IReadOnlyList<Merchant> list;
        if (currentUser.IsAdmin)
        {
            list = await merchants.ListAsync(cancellationToken);
        }
        else
        {
            var owned = await merchants.GetByOwnerAsync(RequireUser(), cancellationToken);
            list = owned is null ? [] : [owned];
        }

        return list.Where(x =>
                string.IsNullOrWhiteSpace(search) ||
                x.CompanyName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                (x.Industry?.Contains(search, StringComparison.OrdinalIgnoreCase) ?? false))
            .Where(x => status is null || x.Status == status)
            .Where(x => risk is null || x.RiskLevel == risk)
            .Where(x => string.IsNullOrWhiteSpace(businessType) || x.BusinessType == businessType)
            .Where(x => string.IsNullOrWhiteSpace(industry) || x.Industry == industry)
            .ToList();
    }

    public async Task<Merchant?> GetAccessibleAsync(
        Guid? merchantId,
        CancellationToken cancellationToken = default)
    {
        Merchant? merchant;
        if (currentUser.IsAdmin && merchantId.HasValue)
        {
            merchant = await merchants.GetAsync(merchantId.Value, cancellationToken);
            var profileChanged = SynchronizeProfileMilestone(merchant);
            await SynchronizeDocumentMilestoneAsync(merchant, cancellationToken);
            if (profileChanged)
            {
                await merchants.SaveChangesAsync(cancellationToken);
            }
            return merchant;
        }

        var owned = await merchants.GetByOwnerAsync(RequireUser(), cancellationToken);
        if (merchantId.HasValue && owned?.Id != merchantId)
        {
            throw new UnauthorizedAccessException("The merchant is not accessible.");
        }

        var ownedProfileChanged = SynchronizeProfileMilestone(owned);
        await SynchronizeDocumentMilestoneAsync(owned, cancellationToken);
        if (ownedProfileChanged)
        {
            await merchants.SaveChangesAsync(cancellationToken);
        }
        return owned;
    }

    public async Task<DashboardModel> GetDashboardAsync(CancellationToken cancellationToken = default)
    {
        var list = await ListAsync(null, null, null, cancellationToken: cancellationToken);
        var decided = list.Count(x => x.Status is MerchantStatus.Approved or MerchantStatus.Rejected);
        var currentMerchant = currentUser.IsAdmin ? null : list.SingleOrDefault();
        var merchantId = currentMerchant?.Id;
        var recentActivity = await activities.ListRecentAsync(merchantId, 8, cancellationToken);
        return new DashboardModel(
            list.Count,
            list.Count(x => x.Status == MerchantStatus.Pending),
            list.Count(x => x.Status == MerchantStatus.UnderReview),
            list.Count(x => x.Status == MerchantStatus.Approved),
            list.Count(x => x.Status == MerchantStatus.Rejected),
            list.Count(x => x.RiskLevel == RiskLevel.High),
            decided == 0 ? 0 : decimal.Round(
                list.Count(x => x.Status == MerchantStatus.Approved) * 100m / decided, 1),
            currentMerchant,
            list.Where(x => x.Status is MerchantStatus.Pending or MerchantStatus.UnderReview)
                .Take(5).ToList(),
            recentActivity.Select(ToDashboardActivity).ToList());
    }

    public async Task UpdateProfileAsync(
        Guid merchantId,
        MerchantProfileModel model,
        CancellationToken cancellationToken = default)
    {
        var merchant = await RequireOwnedMerchantAsync(merchantId, cancellationToken);
        var contact = merchant.Contacts.FirstOrDefault(x => x.IsPrimary)
            ?? throw new InvalidOperationException("Primary contact is missing.");
        var address = merchant.Addresses.FirstOrDefault(x => x.IsPrimary)
            ?? throw new InvalidOperationException("Primary address is missing.");

        merchant.CompanyName = model.CompanyName.Trim();
        merchant.TradingName = Clean(model.TradingName);
        merchant.RegistrationNumber = Clean(model.RegistrationNumber);
        merchant.TaxId = model.TaxId.Trim();
        merchant.BusinessType = model.BusinessType.Trim();
        merchant.Industry = model.Industry.Trim();
        merchant.Website = Clean(model.Website);
        merchant.Description = Clean(model.Description);
        merchant.FoundedYear = model.FoundedYear;
        merchant.EmployeeCount = model.EmployeeCount;
        merchant.AnnualRevenueRange = Clean(model.AnnualRevenueRange);
        merchant.RiskLevel = CalculateRisk(merchant);
        merchant.UpdatedAtUtc = DateTime.UtcNow;

        contact.Name = model.ContactName.Trim();
        contact.Email = model.ContactEmail.Trim();
        contact.Phone = Clean(model.Phone);
        contact.Position = Clean(model.Position);

        address.StreetAddress = model.StreetAddress.Trim();
        address.City = model.City.Trim();
        address.State = Clean(model.State);
        address.PostalCode = model.PostalCode.Trim();
        address.Country = model.Country.Trim();

        await activities.AddAsync(new ActivityEntry
        {
            MerchantId = merchant.Id,
            ActorUserId = RequireUser(),
            Action = "merchant_profile_updated",
            EntityType = nameof(Merchant),
            EntityId = merchant.Id.ToString(),
            Details = merchant.CompanyName
        }, cancellationToken);

        CompleteProfileMilestone(merchant);
        await merchants.SaveChangesAsync(cancellationToken);
    }

    public async Task UploadLogoAsync(
        Guid merchantId,
        string contentType,
        long size,
        Stream stream,
        CancellationToken cancellationToken = default)
    {
        if (size <= 0 || size > 2 * 1024 * 1024 || !AllowedLogoTypes.Contains(contentType))
        {
            throw new InvalidOperationException("Upload a PNG or JPEG logo up to 2 MB.");
        }

        var merchant = await RequireOwnedMerchantAsync(merchantId, cancellationToken);
        var oldStorageName = merchant.LogoStorageName;
        var extension = contentType == "image/png" ? ".png" : ".jpg";
        merchant.LogoStorageName = await logoStorage.SaveAsync(stream, extension, cancellationToken);
        merchant.LogoContentType = contentType;
        merchant.UpdatedAtUtc = DateTime.UtcNow;

        await activities.AddAsync(new ActivityEntry
        {
            MerchantId = merchant.Id,
            ActorUserId = RequireUser(),
            Action = "company_logo_updated",
            EntityType = nameof(Merchant),
            EntityId = merchant.Id.ToString(),
            Details = merchant.CompanyName
        }, cancellationToken);
        await merchants.SaveChangesAsync(cancellationToken);

        if (!string.IsNullOrWhiteSpace(oldStorageName))
        {
            await logoStorage.DeleteAsync(oldStorageName, cancellationToken);
        }
    }

    public async Task<StoredFile?> OpenLogoAsync(
        Guid merchantId,
        CancellationToken cancellationToken = default)
    {
        var merchant = await GetAccessibleAsync(merchantId, cancellationToken);
        if (merchant?.LogoStorageName is null || merchant.LogoContentType is null)
        {
            return null;
        }

        var stream = await logoStorage.OpenReadAsync(merchant.LogoStorageName, cancellationToken);
        return stream is null
            ? null
            : new StoredFile(stream, merchant.LogoContentType, $"{merchant.CompanyName}-logo");
    }

    private async Task<Merchant> RequireOwnedMerchantAsync(
        Guid merchantId,
        CancellationToken cancellationToken)
    {
        if (currentUser.IsAdmin)
        {
            throw new UnauthorizedAccessException("Merchant profile changes require a merchant account.");
        }

        return await GetAccessibleAsync(merchantId, cancellationToken)
            ?? throw new InvalidOperationException("Merchant not found.");
    }

    private static DashboardActivity ToDashboardActivity(ActivityEntry activity)
    {
        var merchantName = activity.Merchant?.CompanyName;
        var subject = string.IsNullOrWhiteSpace(merchantName) ? "A merchant" : merchantName;
        var (title, description) = activity.Action switch
        {
            "document_uploaded" => (
                "KYC document uploaded",
                $"{subject} uploaded {Humanize(activity.Details ?? "a KYC document")}."),
            "merchant_profile_updated" => (
                "Merchant profile updated",
                $"{subject} updated its company profile."),
            "company_logo_updated" => (
                "Company logo updated",
                $"{subject} uploaded a new company logo."),
            "application_ready_for_review" => (
                "Application ready for review",
                $"{subject} submitted all required KYC documents."),
            "compliance_review_completed" => (
                "Compliance review completed",
                $"An administrator completed compliance review for {subject}."),
            "kyc_document_verified" => (
                "KYC document verified",
                $"An administrator verified {Humanize(activity.Details ?? "a KYC document")} for {subject}."),
            "kyc_document_rejected" => (
                "KYC document rejected",
                $"An administrator rejected {Humanize(activity.Details ?? "a KYC document")} for {subject}."),
            "application_approved" => (
                "Application approved",
                $"{subject} was approved by an administrator."),
            "application_rejected" => (
                "Application rejected",
                $"{subject} was rejected by an administrator."),
            "application_moreinformationrequired" => (
                "Additional documents requested",
                $"An administrator requested more information from {subject}."),
            "api_credential_issued" => (
                "API credential issued",
                $"{subject} generated a new API credential."),
            _ => (Humanize(activity.Action), $"{subject}: {Humanize(activity.Details ?? activity.Action)}.")
        };

        return new DashboardActivity(
            activity.Id,
            activity.MerchantId,
            merchantName,
            title,
            description,
            activity.CreatedAtUtc);
    }

    private static string Humanize(string value)
    {
        var words = value.Replace('_', ' ').Trim();
        return string.IsNullOrWhiteSpace(words)
            ? "Activity recorded"
            : char.ToUpperInvariant(words[0]) + words[1..];
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

    private async Task SynchronizeDocumentMilestoneAsync(
        Merchant? merchant,
        CancellationToken cancellationToken)
    {
        if (merchant is null)
        {
            return;
        }

        var requiredTypes = new[]
        {
            "business_registration",
            "tax_certificate",
            "id_document"
        };
        var complete = requiredTypes.All(type =>
            merchant.KycDocuments.Any(x => x.DocumentType == type));
        var milestone = merchant.KycMilestones.SingleOrDefault(x => x.Type == "documents");
        if (!complete || milestone is null || milestone.IsCompleted)
        {
            return;
        }

        milestone.IsCompleted = true;
        milestone.CompletedAtUtc = DateTime.UtcNow;
        if (merchant.Status == MerchantStatus.Pending)
        {
            merchant.Status = MerchantStatus.UnderReview;
            merchant.UpdatedAtUtc = DateTime.UtcNow;
        }

        await merchants.SaveChangesAsync(cancellationToken);
    }

    private static void CompleteProfileMilestone(Merchant merchant)
    {
        var milestone = merchant.KycMilestones.SingleOrDefault(x => x.Type == "profile");
        if (milestone is null || milestone.IsCompleted)
        {
            return;
        }

        milestone.IsCompleted = true;
        milestone.CompletedAtUtc = DateTime.UtcNow;
    }

    private static bool SynchronizeProfileMilestone(Merchant? merchant)
    {
        if (merchant is null)
        {
            return false;
        }

        var milestone = merchant.KycMilestones.SingleOrDefault(x => x.Type == "profile");
        if (milestone is null)
        {
            return false;
        }

        var completedByProfileSave = merchant.Activities.Any(x => x.Action == "merchant_profile_updated");
        if (completedByProfileSave == milestone.IsCompleted)
        {
            return false;
        }

        milestone.IsCompleted = completedByProfileSave;
        milestone.CompletedAtUtc = completedByProfileSave ? DateTime.UtcNow : null;
        return true;
    }

    private string RequireUser() =>
        currentUser.UserId ?? throw new UnauthorizedAccessException("Authentication required.");
}
