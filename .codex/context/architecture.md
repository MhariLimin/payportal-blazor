# Architecture

## Runtime

- ASP.NET Core 8 Blazor Web App using Interactive Server rendering.
- ASP.NET Core Identity for authentication, password reset, and roles.
- Entity Framework Core with Pomelo's MySQL provider.
- Local private file storage behind an application abstraction for KYC uploads.

## Clean Architecture

- `src/PayPortal.Domain`: entities, enums, and domain rules.
- `src/PayPortal.Application`: DTOs, service contracts, repository contracts,
  and use-case services.
- `src/PayPortal.Infrastructure`: EF Core, Identity, repositories, credential
  generation, file storage, seeding, and external concerns.
- `src/PayPortal.Web`: Blazor components, layouts, account endpoints, and DI.

Dependencies point inward: Web and Infrastructure depend on Application and
Domain; Application depends only on Domain; Domain has no project dependency.

## Security Boundaries

- Merchant ownership and administrator permissions are checked in services.
- KYC files are stored outside `wwwroot` and streamed through authorized code.
- API secrets are generated server-side, hashed at rest, and shown once.
- Review decisions and sensitive operations create activity records.
- Production secrets belong in environment variables or user secrets.

## React-to-Blazor Mapping

| React reference | Blazor route | Authorization |
| --- | --- | --- |
| `Login.tsx` | `/account/login` | Anonymous |
| Registration request | `/account/register` | Anonymous |
| Password reset | `/account/forgot-password`, `/account/reset-password` | Anonymous |
| `Dashboard.tsx` | `/` | Merchant or Admin |
| `Applications.tsx` | `/applications` | Admin |
| `MerchantProfile.tsx` | `/merchant/profile` and `/merchants/{id}` | Owner or Admin |
| `KYCVerification.tsx` | `/kyc` and `/merchants/{id}/kyc` | Owner or Admin |
| `APICredentials.tsx` | `/api-credentials` | Approved Merchant |
| `AdminReview.tsx` | `/admin/reviews` | Admin |

