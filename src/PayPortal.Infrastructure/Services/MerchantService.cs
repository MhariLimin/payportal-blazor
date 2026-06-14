using PayPortal.Application.Abstractions;
using PayPortal.Application.Models;
using PayPortal.Domain.Entities;
using PayPortal.Domain.Enums;

namespace PayPortal.Infrastructure.Services;

internal sealed class MerchantService(
    IMerchantRepository merchants,
    IActivityRepository activities,
    ICurrentUser currentUser) : IMerchantService
{
    public async Task<IReadOnlyList<Merchant>> ListAsync(
        string? search,
        MerchantStatus? status,
        RiskLevel? risk,
        CancellationToken cancellationToken = default)
    {
        var list = currentUser.IsAdmin
            ? await merchants.ListAsync(cancellationToken)
            : [await merchants.GetByOwnerAsync(RequireUser(), cancellationToken)]
                .OfType<Merchant>().ToList();

        return list.Where(x =>
                string.IsNullOrWhiteSpace(search) ||
                x.CompanyName.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                (x.Industry?.Contains(search, StringComparison.OrdinalIgnoreCase) ?? false))
            .Where(x => status is null || x.Status == status)
            .Where(x => risk is null || x.RiskLevel == risk)
            .ToList();
    }

    public async Task<Merchant?> GetAccessibleAsync(
        Guid? merchantId,
        CancellationToken cancellationToken = default)
    {
        if (currentUser.IsAdmin && merchantId.HasValue)
        {
            return await merchants.GetAsync(merchantId.Value, cancellationToken);
        }

        var owned = await merchants.GetByOwnerAsync(RequireUser(), cancellationToken);
        if (merchantId.HasValue && owned?.Id != merchantId)
        {
            throw new UnauthorizedAccessException("The merchant is not accessible.");
        }

        return owned;
    }

    public async Task<DashboardModel> GetDashboardAsync(CancellationToken cancellationToken = default)
    {
        var list = await ListAsync(null, null, null, cancellationToken);
        var decided = list.Count(x => x.Status is MerchantStatus.Approved or MerchantStatus.Rejected);
        var merchantId = currentUser.IsAdmin ? null : list.SingleOrDefault()?.Id;
        return new DashboardModel(
            list.Count,
            list.Count(x => x.Status == MerchantStatus.Pending),
            list.Count(x => x.Status == MerchantStatus.UnderReview),
            list.Count(x => x.Status == MerchantStatus.Approved),
            list.Count(x => x.Status == MerchantStatus.Rejected),
            list.Count(x => x.RiskLevel == RiskLevel.High),
            decided == 0 ? 0 : decimal.Round(
                list.Count(x => x.Status == MerchantStatus.Approved) * 100m / decided, 1),
            list.Where(x => x.Status is MerchantStatus.Pending or MerchantStatus.UnderReview)
                .Take(5).ToList(),
            await activities.ListRecentAsync(merchantId, 8, cancellationToken));
    }

    private string RequireUser() =>
        currentUser.UserId ?? throw new UnauthorizedAccessException("Authentication required.");
}
