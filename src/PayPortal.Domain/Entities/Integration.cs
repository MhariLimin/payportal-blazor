using PayPortal.Domain.Common;
using PayPortal.Domain.Enums;

namespace PayPortal.Domain.Entities;

public sealed class ApiCredential : Entity
{
    public Guid MerchantId { get; set; }
    public Merchant Merchant { get; set; } = null!;
    public required string Name { get; set; }
    public required string PublicKey { get; set; }
    public required string SecretHash { get; set; }
    public CredentialEnvironment Environment { get; set; }
    public required string PermissionsCsv { get; set; }
    public DateTime? LastUsedAtUtc { get; set; }
    public DateTime? ExpiresAtUtc { get; set; }
    public DateTime? RevokedAtUtc { get; set; }
    public bool IsActive => RevokedAtUtc is null &&
        (ExpiresAtUtc is null || ExpiresAtUtc > DateTime.UtcNow);
}

public sealed class Webhook : Entity
{
    public Guid MerchantId { get; set; }
    public Merchant Merchant { get; set; } = null!;
    public required string Url { get; set; }
    public required string SecretHash { get; set; }
    public required string EventsCsv { get; set; }
    public bool IsActive { get; set; } = true;
}

public sealed class ActivityEntry : Entity
{
    public Guid? MerchantId { get; set; }
    public Merchant? Merchant { get; set; }
    public required string ActorUserId { get; set; }
    public required string Action { get; set; }
    public required string EntityType { get; set; }
    public string? EntityId { get; set; }
    public string? Details { get; set; }
}
