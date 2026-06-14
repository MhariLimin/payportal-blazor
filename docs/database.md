# Database Schema

`PortalDbContext` is the Code First source of truth.

## Main Relationships

```text
AspNetUsers 1 ---- 0..1 Merchant
Merchant 1 ---- * MerchantContact
Merchant 1 ---- * MerchantAddress
Merchant 1 ---- * KycDocument
Merchant 1 ---- * KycMilestone
Merchant 1 ---- * ApplicationReview
Merchant 1 ---- * ApiCredential
Merchant 1 ---- * Webhook
Merchant 1 ---- * ActivityEntry
```

## Important Columns

- Merchant: owner user ID, company and tax data, status, risk, approval audit.
- KYC document: generated storage name, media type, size, review status, notes.
- API credential: public key, password-hashed secret, environment, permissions,
  expiry, and revocation time.
- Review: reviewer user ID, decision, notes, and UTC timestamp.
- Activity: actor, action, entity, optional merchant, and non-sensitive detail.

## Migrations

```powershell
$env:PAYPORTAL_CONNECTION="Server=localhost;Port=3306;Database=payportal;User=payportal;Password=payportal"
dotnet ef migrations add InitialCreate --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
dotnet ef database update --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
```

Development falls back to `EnsureCreated` only when no migration is present.
Production should always deploy generated, reviewed migrations.
