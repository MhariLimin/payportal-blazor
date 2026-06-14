using PayPortal.Domain.Common;
using PayPortal.Domain.Enums;

namespace PayPortal.Domain.Entities;

public sealed class KycDocument : Entity
{
    public Guid MerchantId { get; set; }
    public Merchant Merchant { get; set; } = null!;
    public required string DocumentType { get; set; }
    public required string DocumentName { get; set; }
    public required string StorageName { get; set; }
    public long FileSize { get; set; }
    public required string ContentType { get; set; }
    public DocumentStatus Status { get; set; } = DocumentStatus.Pending;
    public string? RejectionReason { get; set; }
    public string? ReviewerNotes { get; set; }
    public DateTime? ReviewedAtUtc { get; set; }
    public string? ReviewedByUserId { get; set; }
}

public sealed class KycMilestone : Entity
{
    public Guid MerchantId { get; set; }
    public Merchant Merchant { get; set; } = null!;
    public required string Type { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public bool IsRequired { get; set; } = true;
    public bool IsCompleted { get; set; }
    public DateTime? CompletedAtUtc { get; set; }
}

public sealed class ApplicationReview : Entity
{
    public Guid MerchantId { get; set; }
    public Merchant Merchant { get; set; } = null!;
    public required string ReviewerUserId { get; set; }
    public required string ReviewType { get; set; }
    public required string Notes { get; set; }
    public ReviewDecision Decision { get; set; }
}
