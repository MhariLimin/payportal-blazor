namespace PayPortal.Application.Common;

public static class PortalRoles
{
    public const string Merchant = "Merchant";
    public const string Admin = "Admin";
    public const string MerchantOrAdmin = Merchant + "," + Admin;
}
