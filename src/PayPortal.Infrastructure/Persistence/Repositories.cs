using Microsoft.EntityFrameworkCore;
using PayPortal.Application.Abstractions;
using PayPortal.Domain.Entities;

namespace PayPortal.Infrastructure.Persistence;

internal sealed class MerchantRepository(PortalDbContext dbContext) : IMerchantRepository
{
    public async Task<IReadOnlyList<Merchant>> ListAsync(CancellationToken cancellationToken = default) =>
        await Query().OrderByDescending(x => x.CreatedAtUtc).ToListAsync(cancellationToken);

    public Task<Merchant?> GetAsync(Guid id, CancellationToken cancellationToken = default) =>
        Query().SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task<Merchant?> GetByOwnerAsync(string ownerUserId, CancellationToken cancellationToken = default) =>
        Query().SingleOrDefaultAsync(x => x.OwnerUserId == ownerUserId, cancellationToken);

    public Task AddAsync(Merchant merchant, CancellationToken cancellationToken = default) =>
        dbContext.Merchants.AddAsync(merchant, cancellationToken).AsTask();

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        dbContext.SaveChangesAsync(cancellationToken);

    private IQueryable<Merchant> Query() => dbContext.Merchants
        .Include(x => x.Contacts)
        .Include(x => x.Addresses)
        .Include(x => x.KycDocuments)
        .Include(x => x.KycMilestones)
        .Include(x => x.Reviews)
        .Include(x => x.ApiCredentials)
        .Include(x => x.Webhooks)
        .Include(x => x.Activities)
        .AsSplitQuery();
}

internal sealed class ActivityRepository(PortalDbContext dbContext) : IActivityRepository
{
    public async Task<IReadOnlyList<ActivityEntry>> ListRecentAsync(
        Guid? merchantId,
        int count,
        CancellationToken cancellationToken = default)
    {
        IQueryable<ActivityEntry> query = dbContext.ActivityEntries
            .AsNoTracking()
            .Include(x => x.Merchant);
        if (merchantId.HasValue)
        {
            query = query.Where(x => x.MerchantId == merchantId);
        }

        return await query.OrderByDescending(x => x.CreatedAtUtc)
            .Take(count).ToListAsync(cancellationToken);
    }

    public Task AddAsync(ActivityEntry entry, CancellationToken cancellationToken = default) =>
        dbContext.ActivityEntries.AddAsync(entry, cancellationToken).AsTask();
}
