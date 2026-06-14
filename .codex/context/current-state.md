# Current State

## Migration

The Bolt-generated React/Vite/Supabase prototype has been replaced by a native
ASP.NET Core 8 Blazor Server application. React remains only as the UX reference
captured in the migration specification and Git history.

## Target Capabilities

- Identity login, logout, registration, password reset, and Merchant/Admin roles.
- Merchant company, address, and contact onboarding.
- Private KYC document upload and approval timeline.
- Admin application search, review, approval, rejection, and document requests.
- API key generation and rotation with one-time secret display.
- Dashboard statistics, approval funnel, pending work, and recent activity.

## Verification

- .NET SDK 8.0.422 installed.
- Solution restore succeeds.
- Solution build succeeds with zero warnings and errors.
- Initial MySQL EF Core migration generated.
- MySQL migration application, role/admin seeding, anonymous account routes,
  authenticated admin dashboard, and merchant registration smoke tests pass.
- Automated tests remain future work.
