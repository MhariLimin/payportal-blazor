using System.ComponentModel.DataAnnotations;
using PayPortal.Domain.Entities;
using PayPortal.Domain.Enums;

namespace PayPortal.Application.Models;

public sealed class MerchantRegistrationModel
{
    [Required, StringLength(200)] public string CompanyName { get; set; } = "";
    [Required, StringLength(100)] public string BusinessType { get; set; } = "";
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
    IReadOnlyList<ActivityEntry> RecentActivity);

public sealed record IssuedCredential(
    Guid Id,
    string Name,
    string PublicKey,
    string Secret,
    CredentialEnvironment Environment);

public sealed record ReviewRequest(ReviewDecision Decision, string Notes);
