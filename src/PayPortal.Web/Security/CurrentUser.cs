using System.Security.Claims;
using PayPortal.Application.Abstractions;
using PayPortal.Application.Common;

namespace PayPortal.Web.Security;

internal sealed class CurrentUser(IHttpContextAccessor accessor) : ICurrentUser
{
    private ClaimsPrincipal Principal => accessor.HttpContext?.User ?? new ClaimsPrincipal();
    public string? UserId => Principal.FindFirstValue(ClaimTypes.NameIdentifier);
    public bool IsAdmin => Principal.IsInRole(PortalRoles.Admin);
}
