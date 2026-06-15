using System.ComponentModel.DataAnnotations;
using PayPortal.Domain.Entities;
using PayPortal.Domain.Enums;

namespace PayPortal.Application.Models;

public sealed class MerchantRegistrationModel
{
    [Required, StringLength(200)] public string CompanyName { get; set; } = "";
    [Required, StringLength(100)] public string BusinessType { get; set; } = "";
    [Required, StringLength(100)] public string Industry { get; set; } = "";
    [Required, StringLength(100)] public string TaxId { get; set; } = "";
    [Required, EmailAddress] public string Email { get; set; } = "";
    [Required, MinLength(8)] public string Password { get; set; } = "";
    [Required, Compare(nameof(Password))] public string ConfirmPassword { get; set; } = "";
    [Required, StringLength(150)] public string ContactName { get; set; } = "";
    [Phone] public string? Phone { get; set; }
    [Required, StringLength(250)] public string StreetAddress { get; set; } = "";
    [Required, StringLength(100)] public string City { get; set; } = "";
    [StringLength(100)] public string? State { get; set; }
    [Required, StringLength(30)] public string PostalCode { get; set; } = "";
    [Required, StringLength(100)] public string Country { get; set; } = "";
}

public sealed class MerchantProfileModel
{
    [Required, StringLength(200)] public string CompanyName { get; set; } = "";
    [StringLength(200)] public string? TradingName { get; set; }
    [StringLength(100)] public string? RegistrationNumber { get; set; }
    [Required, StringLength(100)] public string TaxId { get; set; } = "";
    [Required, StringLength(100)] public string BusinessType { get; set; } = "";
    [Required, StringLength(100)] public string Industry { get; set; } = "";
    [Url, StringLength(300)] public string? Website { get; set; }
    [StringLength(1000)] public string? Description { get; set; }
    [Range(1800, 2100)] public int? FoundedYear { get; set; }
    [Range(1, 1_000_000)] public int? EmployeeCount { get; set; }
    [StringLength(100)] public string? AnnualRevenueRange { get; set; }
    [Required, StringLength(150)] public string ContactName { get; set; } = "";
    [Required, EmailAddress] public string ContactEmail { get; set; } = "";
    [Phone] public string? Phone { get; set; }
    [StringLength(150)] public string? Position { get; set; }
    [Required, StringLength(250)] public string StreetAddress { get; set; } = "";
    [Required, StringLength(100)] public string City { get; set; } = "";
    [StringLength(100)] public string? State { get; set; }
    [Required, StringLength(30)] public string PostalCode { get; set; } = "";
    [Required, StringLength(100)] public string Country { get; set; } = "";
}

public static class MerchantOptions
{
    public static readonly string[] BusinessTypes =
    [
        "Sole Proprietorship",
        "Partnership",
        "Corporation",
        "Limited Liability Company",
        "Nonprofit Organization",
        "Government Entity"
    ];

    public static readonly string[] Industries =
    [
        "Financial Services",
        "Retail and E-commerce",
        "Technology and Software",
        "Professional Services",
        "Healthcare",
        "Education",
        "Hospitality and Travel",
        "Manufacturing",
        "Logistics and Transportation",
        "Real Estate",
        "Other"
    ];
}

public sealed class LoginModel
{
    [Required, EmailAddress] public string Email { get; set; } = "";
    [Required] public string Password { get; set; } = "";
    public bool RememberMe { get; set; }
}

public sealed record DashboardModel(
    int TotalMerchants,
    int PendingApplications,
    int UnderReview,
    int Approved,
    int Rejected,
    int HighRisk,
    decimal ApprovalRate,
    IReadOnlyList<Merchant> Pending,
    IReadOnlyList<DashboardActivity> RecentActivity);

public sealed record DashboardActivity(
    Guid Id,
    Guid? MerchantId,
    string? MerchantName,
    string Title,
    string Description,
    DateTime CreatedAtUtc);

public sealed record StoredFile(Stream Stream, string ContentType, string DownloadName);

public sealed record IssuedCredential(
    Guid Id,
    string Name,
    string PublicKey,
    string Secret,
    CredentialEnvironment Environment);

public sealed record ReviewRequest(ReviewDecision Decision, string Notes);
