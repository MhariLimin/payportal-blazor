using Microsoft.EntityFrameworkCore;
using PayPortal.Application.Abstractions;
using PayPortal.Application.Models;
using PayPortal.Infrastructure.Persistence;

namespace PayPortal.Infrastructure.Services;

internal sealed class ActivityService(
    PortalDbContext dbContext,
    ICurrentUser currentUser) : IActivityService
{
    public async Task<IReadOnlyList<ActivityLogItem>> ListAsync(
        ActivityLogFilter filter,
        int count = 50,
        CancellationToken cancellationToken = default)
    {
        IQueryable<PayPortal.Domain.Entities.ActivityEntry> query = dbContext.ActivityEntries
            .AsNoTracking()
            .Include(x => x.Merchant);

        if (currentUser.IsAdmin)
        {
            if (filter.MerchantId.HasValue)
            {
                query = query.Where(x => x.MerchantId == filter.MerchantId);
            }
        }
        else
        {
            var userId = currentUser.UserId
                ?? throw new UnauthorizedAccessException("Authentication required.");
            query = query.Where(x => x.Merchant != null && x.Merchant.OwnerUserId == userId);
        }

        if (!string.IsNullOrWhiteSpace(filter.ActorUserId))
        {
            query = query.Where(x => x.ActorUserId.Contains(filter.ActorUserId));
        }

        if (!string.IsNullOrWhiteSpace(filter.Action))
        {
            query = query.Where(x => x.Action == filter.Action);
        }

        if (filter.FromUtc.HasValue)
        {
            query = query.Where(x => x.CreatedAtUtc >= filter.FromUtc);
        }

        if (filter.ToUtc.HasValue)
        {
            query = query.Where(x => x.CreatedAtUtc <= filter.ToUtc);
        }

        var entries = await query.OrderByDescending(x => x.CreatedAtUtc)
            .Take(Math.Clamp(count, 1, 200))
            .ToListAsync(cancellationToken);

        return entries.Select(ToLogItem).ToList();
    }

    private static ActivityLogItem ToLogItem(PayPortal.Domain.Entities.ActivityEntry activity)
    {
        var merchantName = activity.Merchant?.CompanyName;
        var subject = string.IsNullOrWhiteSpace(merchantName) ? "A merchant" : merchantName;
        var (title, description) = activity.Action switch
        {
            "document_uploaded" => (
                "KYC document uploaded",
                $"{subject} uploaded {Humanize(activity.Details ?? "a KYC document")}."),
            "kyc_document_verified" => (
                "KYC document verified",
                $"An administrator verified {Humanize(activity.Details ?? "a KYC document")} for {subject}."),
            "kyc_document_rejected" => (
                "KYC document rejected",
                $"An administrator rejected {Humanize(activity.Details ?? "a KYC document")} for {subject}."),
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

        return new(
            activity.Id,
            activity.MerchantId,
            merchantName,
            activity.ActorUserId,
            activity.Action,
            title,
            description,
            activity.EntityType,
            activity.EntityId,
            activity.CreatedAtUtc);
    }

    private static string Humanize(string value)
    {
        var words = value.Replace('_', ' ').Trim();
        return string.IsNullOrWhiteSpace(words)
            ? "Activity recorded"
            : char.ToUpperInvariant(words[0]) + words[1..];
    }
}
