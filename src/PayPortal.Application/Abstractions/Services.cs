using PayPortal.Application.Models;
using PayPortal.Domain.Entities;
using PayPortal.Domain.Enums;

namespace PayPortal.Application.Abstractions;

public interface ICurrentUser
{
    string? UserId { get; }
    bool IsAdmin { get; }
}

public interface IMerchantService
{
    Task<IReadOnlyList<Merchant>> ListAsync(string? search, MerchantStatus? status, RiskLevel? risk, CancellationToken cancellationToken = default);
    Task<Merchant?> GetAccessibleAsync(Guid? merchantId, CancellationToken cancellationToken = default);
    Task<DashboardModel> GetDashboardAsync(CancellationToken cancellationToken = default);
}

public interface IKycService
{
    Task<KycDocument> UploadAsync(Guid merchantId, string type, string fileName, string contentType, long size, Stream stream, CancellationToken cancellationToken = default);
}

public interface ICredentialService
{
    Task<IssuedCredential> IssueAsync(Guid merchantId, string name, CredentialEnvironment environment, IReadOnlyCollection<string> permissions, CancellationToken cancellationToken = default);
    Task<IssuedCredential> RotateAsync(Guid credentialId, CancellationToken cancellationToken = default);
}

public interface IReviewService
{
    Task ReviewAsync(Guid merchantId, ReviewRequest request, CancellationToken cancellationToken = default);
}
