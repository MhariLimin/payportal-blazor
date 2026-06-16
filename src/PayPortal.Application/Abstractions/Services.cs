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
    Task<IReadOnlyList<Merchant>> ListAsync(string? search, MerchantStatus? status, RiskLevel? risk, string? businessType = null, string? industry = null, CancellationToken cancellationToken = default);
    Task<Merchant?> GetAccessibleAsync(Guid? merchantId, CancellationToken cancellationToken = default);
    Task<DashboardModel> GetDashboardAsync(CancellationToken cancellationToken = default);
    Task UpdateProfileAsync(Guid merchantId, MerchantProfileModel model, CancellationToken cancellationToken = default);
    Task UploadLogoAsync(Guid merchantId, string contentType, long size, Stream stream, CancellationToken cancellationToken = default);
    Task<StoredFile?> OpenLogoAsync(Guid merchantId, CancellationToken cancellationToken = default);
}

public interface IActivityService
{
    Task<IReadOnlyList<ActivityLogItem>> ListAsync(
        ActivityLogFilter filter,
        int count = 50,
        CancellationToken cancellationToken = default);
}

public interface IKycService
{
    Task<KycDocument> UploadAsync(Guid merchantId, string type, string fileName, string contentType, long size, Stream stream, CancellationToken cancellationToken = default);
    Task<StoredFile?> OpenDocumentAsync(Guid documentId, CancellationToken cancellationToken = default);
}

public interface ICredentialService
{
    Task<IssuedCredential> IssueAsync(Guid merchantId, string name, CredentialEnvironment environment, IReadOnlyCollection<string> permissions, CancellationToken cancellationToken = default);
    Task<IssuedCredential> RotateAsync(Guid credentialId, CancellationToken cancellationToken = default);
}

public interface IReviewService
{
    Task ReviewAsync(Guid merchantId, ReviewRequest request, CancellationToken cancellationToken = default);
    Task CompleteComplianceReviewAsync(Guid merchantId, string notes, CancellationToken cancellationToken = default);
    Task ReviewDocumentAsync(Guid documentId, DocumentReviewRequest request, CancellationToken cancellationToken = default);
}

public interface IRegistrationService
{
    Task<(bool Succeeded, IReadOnlyList<string> Errors)> RegisterMerchantAsync(
        MerchantRegistrationModel model,
        CancellationToken cancellationToken = default);
}
