namespace PayPortal.Domain.Enums;

public enum MerchantStatus
{
    Draft,
    Pending,
    UnderReview,
    Approved,
    Rejected,
    Suspended
}

public enum RiskLevel { Low, Medium, High }
public enum DocumentStatus { Pending, Verified, Rejected }
public enum CredentialEnvironment { Sandbox, Production }
public enum ReviewDecision { Approved, Rejected, MoreInformationRequired }
