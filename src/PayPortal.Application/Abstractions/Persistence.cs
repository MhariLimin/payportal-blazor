using PayPortal.Domain.Entities;

namespace PayPortal.Application.Abstractions;

public interface IMerchantRepository
{
    Task<IReadOnlyList<Merchant>> ListAsync(CancellationToken cancellationToken = default);
    Task<Merchant?> GetAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Merchant?> GetByOwnerAsync(string ownerUserId, CancellationToken cancellationToken = default);
    Task AddAsync(Merchant merchant, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public interface IActivityRepository
{
    Task<IReadOnlyList<ActivityEntry>> ListRecentAsync(
        Guid? merchantId,
        int count,
        CancellationToken cancellationToken = default);
    Task AddAsync(ActivityEntry entry, CancellationToken cancellationToken = default);
}

public interface IFileStorage
{
    Task<string> SaveAsync(Stream stream, string extension, CancellationToken cancellationToken);
    Task<Stream?> OpenReadAsync(string storageName, CancellationToken cancellationToken);
    Task DeleteAsync(string storageName, CancellationToken cancellationToken);
}

public interface ISecretGenerator
{
    (string PublicKey, string Secret, string SecretHash) Generate(string environment);
}
