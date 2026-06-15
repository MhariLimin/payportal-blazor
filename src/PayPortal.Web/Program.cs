using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using PayPortal.Application.Abstractions;
using PayPortal.Infrastructure;
using PayPortal.Infrastructure.Persistence;
using PayPortal.Web.Components;
using PayPortal.Web.Security;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();
builder.Services.AddCascadingAuthenticationState();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
        options.DefaultChallengeScheme = IdentityConstants.ApplicationScheme;
        options.DefaultSignInScheme = IdentityConstants.ExternalScheme;
    })
    .AddIdentityCookies();
builder.Services.AddAuthorization();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();
builder.Services.AddInfrastructure(builder.Configuration, builder.Environment.ContentRootPath);

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/error", createScopeForErrors: true);
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/account/logout", async (
    SignInManager<PayPortal.Infrastructure.Identity.PortalUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    return Results.LocalRedirect("/account/login");
}).RequireAuthorization();

app.MapGet("/merchant-logos/{merchantId:guid}", async (
    Guid merchantId,
    IMerchantService merchantService,
    CancellationToken cancellationToken) =>
{
    var file = await merchantService.OpenLogoAsync(merchantId, cancellationToken);
    return file is null
        ? Results.NotFound()
        : Results.File(file.Stream, file.ContentType);
}).RequireAuthorization(policy => policy.RequireRole("Merchant", "Admin"));

app.MapGet("/merchant-logos/current", async (
    IMerchantService merchantService,
    CancellationToken cancellationToken) =>
{
    var merchant = await merchantService.GetAccessibleAsync(null, cancellationToken);
    if (merchant is null)
    {
        return Results.NotFound();
    }

    var file = await merchantService.OpenLogoAsync(merchant.Id, cancellationToken);
    return file is null
        ? Results.NotFound()
        : Results.File(file.Stream, file.ContentType);
}).RequireAuthorization(policy => policy.RequireRole("Merchant"));

app.MapGet("/kyc-documents/{documentId:guid}/download", async (
    Guid documentId,
    IKycService kycService,
    CancellationToken cancellationToken) =>
{
    var file = await kycService.OpenDocumentAsync(documentId, cancellationToken);
    return file is null
        ? Results.NotFound()
        : Results.File(file.Stream, file.ContentType, file.DownloadName);
}).RequireAuthorization(policy => policy.RequireRole("Merchant", "Admin"));

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

await DatabaseSeeder.SeedAsync(app.Services);
await app.RunAsync();
