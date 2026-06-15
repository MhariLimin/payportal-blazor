using Microsoft.AspNetCore.Identity;
using PayPortal.Application.Abstractions;
using PayPortal.Application.Common;
using PayPortal.Application.Models;
using PayPortal.Domain.Entities;
using PayPortal.Infrastructure.Identity;
using PayPortal.Infrastructure.Persistence;

namespace PayPortal.Infrastructure.Services;

internal sealed class RegistrationService(
    PortalDbContext dbContext,
    UserManager<PortalUser> userManager) : IRegistrationService
{
    public async Task<(bool Succeeded, IReadOnlyList<string> Errors)> RegisterMerchantAsync(
        MerchantRegistrationModel model,
        CancellationToken cancellationToken = default)
    {
        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        var user = new PortalUser
        {
            UserName = model.Email.Trim(),
            Email = model.Email.Trim(),
            DisplayName = model.ContactName.Trim(),
            EmailConfirmed = true
        };
        var result = await userManager.CreateAsync(user, model.Password);
        if (!result.Succeeded)
        {
            return (false, result.Errors.Select(x => x.Description).ToList());
        }

        await userManager.AddToRoleAsync(user, PortalRoles.Merchant);
        var merchant = new Merchant
        {
            OwnerUserId = user.Id,
            CompanyName = model.CompanyName.Trim(),
            TaxId = model.TaxId.Trim(),
            BusinessType = model.BusinessType.Trim(),
            Industry = model.Industry.Trim(),
            Contacts =
            [
                new MerchantContact
                {
                    ContactType = "primary",
                    Name = model.ContactName.Trim(),
                    Email = model.Email.Trim(),
                    Phone = model.Phone,
                    IsPrimary = true
                }
            ],
            Addresses =
            [
                new MerchantAddress
                {
                    AddressType = "registered",
                    StreetAddress = model.StreetAddress.Trim(),
                    City = model.City.Trim(),
                    State = model.State?.Trim(),
                    PostalCode = model.PostalCode.Trim(),
                    Country = model.Country.Trim(),
                    IsPrimary = true
                }
            ],
            KycMilestones =
            [
                Milestone("profile", "Complete Company Profile", "Provide the company, contact, and registered address information.", true),
                Milestone("documents", "Upload Required Documents", "Upload the incorporation, tax registration, and director identity documents.", false),
                Milestone("review", "Compliance Review", "An administrator checks the company details and uploaded evidence.", false),
                Milestone("approval", "Application Approval", "The application is approved after compliance review succeeds.", false)
            ]
        };
        dbContext.Merchants.Add(merchant);
        await dbContext.SaveChangesAsync(cancellationToken);
        user.MerchantId = merchant.Id;
        await userManager.UpdateAsync(user);
        await transaction.CommitAsync(cancellationToken);
        return (true, []);
    }

    private static KycMilestone Milestone(
        string type,
        string title,
        string description,
        bool complete) => new()
    {
        Type = type,
        Title = title,
        Description = description,
        IsRequired = true,
        IsCompleted = complete,
        CompletedAtUtc = complete ? DateTime.UtcNow : null
    };
}
