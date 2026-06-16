using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PayPortal.Application.Abstractions;
using PayPortal.Infrastructure.Identity;
using PayPortal.Infrastructure.Persistence;
using PayPortal.Infrastructure.Security;
using PayPortal.Infrastructure.Services;
using PayPortal.Infrastructure.Storage;

namespace PayPortal.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration,
        string contentRoot)
    {
        var connectionString = configuration.GetConnectionString("PayPortal")
            ?? throw new InvalidOperationException("ConnectionStrings:PayPortal is required.");
        static void ConfigurePortalDbContext(DbContextOptionsBuilder options, string connectionString) =>
            options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 0)));

        services.AddDbContext<PortalDbContext>(options =>
            ConfigurePortalDbContext(options, connectionString));
        services.AddDbContextFactory<PortalDbContext>(options =>
            ConfigurePortalDbContext(options, connectionString));

        services.AddIdentityCore<PortalUser>(options =>
            {
                options.Password.RequiredLength = 8;
                options.Password.RequireDigit = true;
                options.Password.RequireUppercase = true;
                options.User.RequireUniqueEmail = true;
                options.SignIn.RequireConfirmedEmail = false;
            })
            .AddRoles<IdentityRole>()
            .AddSignInManager()
            .AddEntityFrameworkStores<PortalDbContext>()
            .AddDefaultTokenProviders();
        services.AddScoped<IPasswordHasher<string>, PasswordHasher<string>>();

        services.AddScoped<IMerchantRepository, MerchantRepository>();
        services.AddScoped<IActivityRepository, ActivityRepository>();
        services.AddScoped<IActivityService, ActivityService>();
        services.AddScoped<IMerchantService, MerchantService>();
        services.AddScoped<IKycService, KycService>();
        services.AddScoped<ICredentialService, CredentialService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IRegistrationService, RegistrationService>();
        services.AddScoped<ISecretGenerator, SecretGenerator>();
        services.AddSingleton<IFileStorage>(
            new PrivateFileStorage(Path.Combine(contentRoot, "uploads", "kyc")));
        services.AddSingleton<ILogoStorage>(
            new PrivateFileStorage(Path.Combine(contentRoot, "uploads", "logos")));
        return services;
    }
}
