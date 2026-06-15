using PayPortal.Domain.Common;
using PayPortal.Domain.Enums;

namespace PayPortal.Domain.Entities;

public sealed class Merchant : Entity
{
    public required string OwnerUserId { get; set; }
    public required string CompanyName { get; set; }
    public string? TradingName { get; set; }
    public string? RegistrationNumber { get; set; }
    public required string TaxId { get; set; }
    public required string BusinessType { get; set; }
    public string? Industry { get; set; }
    public string? Website { get; set; }
    public string? Description { get; set; }
    public int? FoundedYear { get; set; }
    public int? EmployeeCount { get; set; }
    public string? AnnualRevenueRange { get; set; }
    public string? LogoStorageName { get; set; }
    public string? LogoContentType { get; set; }
    public MerchantStatus Status { get; set; } = MerchantStatus.Pending;
    public RiskLevel RiskLevel { get; set; } = RiskLevel.Low;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? ApprovedAtUtc { get; set; }
    public string? ApprovedByUserId { get; set; }

    public ICollection<MerchantContact> Contacts { get; set; } = [];
    public ICollection<MerchantAddress> Addresses { get; set; } = [];
    public ICollection<KycDocument> KycDocuments { get; set; } = [];
    public ICollection<KycMilestone> KycMilestones { get; set; } = [];
    public ICollection<ApplicationReview> Reviews { get; set; } = [];
    public ICollection<ApiCredential> ApiCredentials { get; set; } = [];
    public ICollection<Webhook> Webhooks { get; set; } = [];
    public ICollection<ActivityEntry> Activities { get; set; } = [];
}

public sealed class MerchantContact : Entity
{
    public Guid MerchantId { get; set; }
    public Merchant Merchant { get; set; } = null!;
    public required string ContactType { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public string? Phone { get; set; }
    public string? Position { get; set; }
    public bool IsPrimary { get; set; }
}

public sealed class MerchantAddress : Entity
{
    public Guid MerchantId { get; set; }
    public Merchant Merchant { get; set; } = null!;
    public required string AddressType { get; set; }
    public required string StreetAddress { get; set; }
    public required string City { get; set; }
    public string? State { get; set; }
    public required string PostalCode { get; set; }
    public required string Country { get; set; }
    public bool IsPrimary { get; set; }
}
