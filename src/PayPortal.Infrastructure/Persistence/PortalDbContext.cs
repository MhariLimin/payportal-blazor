using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PayPortal.Domain.Entities;
using PayPortal.Infrastructure.Identity;

namespace PayPortal.Infrastructure.Persistence;

public sealed class PortalDbContext(DbContextOptions<PortalDbContext> options)
    : IdentityDbContext<PortalUser>(options)
{
    public DbSet<Merchant> Merchants => Set<Merchant>();
    public DbSet<MerchantContact> MerchantContacts => Set<MerchantContact>();
    public DbSet<MerchantAddress> MerchantAddresses => Set<MerchantAddress>();
    public DbSet<KycDocument> KycDocuments => Set<KycDocument>();
    public DbSet<KycMilestone> KycMilestones => Set<KycMilestone>();
    public DbSet<ApplicationReview> ApplicationReviews => Set<ApplicationReview>();
    public DbSet<ApiCredential> ApiCredentials => Set<ApiCredential>();
    public DbSet<Webhook> Webhooks => Set<Webhook>();
    public DbSet<ActivityEntry> ActivityEntries => Set<ActivityEntry>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<PortalUser>(entity =>
        {
            entity.Property(x => x.DisplayName).HasMaxLength(150);
            entity.HasIndex(x => x.MerchantId);
        });

        builder.Entity<Merchant>(entity =>
        {
            entity.Property(x => x.CompanyName).HasMaxLength(200);
            entity.Property(x => x.OwnerUserId).HasMaxLength(450);
            entity.Property(x => x.TaxId).HasMaxLength(100);
            entity.Property(x => x.BusinessType).HasMaxLength(100);
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
            entity.Property(x => x.RiskLevel).HasConversion<string>().HasMaxLength(20);
            entity.HasIndex(x => x.OwnerUserId).IsUnique();
            entity.HasIndex(x => x.Status);
        });

        builder.Entity<MerchantContact>(entity =>
        {
            entity.Property(x => x.Name).HasMaxLength(150);
            entity.Property(x => x.Email).HasMaxLength(256);
            entity.HasOne(x => x.Merchant).WithMany(x => x.Contacts)
                .HasForeignKey(x => x.MerchantId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<MerchantAddress>(entity =>
        {
            entity.Property(x => x.StreetAddress).HasMaxLength(250);
            entity.Property(x => x.Country).HasMaxLength(100);
            entity.HasOne(x => x.Merchant).WithMany(x => x.Addresses)
                .HasForeignKey(x => x.MerchantId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<KycDocument>(entity =>
        {
            entity.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
            entity.Property(x => x.StorageName).HasMaxLength(200);
            entity.HasOne(x => x.Merchant).WithMany(x => x.KycDocuments)
                .HasForeignKey(x => x.MerchantId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<KycMilestone>()
            .HasOne(x => x.Merchant).WithMany(x => x.KycMilestones)
            .HasForeignKey(x => x.MerchantId).OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ApplicationReview>(entity =>
        {
            entity.Property(x => x.Decision).HasConversion<string>().HasMaxLength(40);
            entity.HasOne(x => x.Merchant).WithMany(x => x.Reviews)
                .HasForeignKey(x => x.MerchantId).OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<ApiCredential>(entity =>
        {
            entity.Property(x => x.Environment).HasConversion<string>().HasMaxLength(20);
            entity.HasIndex(x => x.PublicKey).IsUnique();
            entity.HasOne(x => x.Merchant).WithMany(x => x.ApiCredentials)
                .HasForeignKey(x => x.MerchantId).OnDelete(DeleteBehavior.Cascade);
            entity.Ignore(x => x.IsActive);
        });

        builder.Entity<Webhook>()
            .HasOne(x => x.Merchant).WithMany(x => x.Webhooks)
            .HasForeignKey(x => x.MerchantId).OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ActivityEntry>(entity =>
        {
            entity.HasIndex(x => x.CreatedAtUtc);
            entity.HasOne(x => x.Merchant).WithMany(x => x.Activities)
                .HasForeignKey(x => x.MerchantId).OnDelete(DeleteBehavior.SetNull);
        });
    }
}
