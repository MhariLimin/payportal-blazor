using Microsoft.AspNetCore.Identity;

namespace PayPortal.Infrastructure.Identity;

public sealed class PortalUser : IdentityUser
{
    public required string DisplayName { get; set; }
    public Guid? MerchantId { get; set; }
}
