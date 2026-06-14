# Current State

## Migration

The Bolt-generated React/Vite/Supabase prototype is being replaced by a native
ASP.NET Core 8 Blazor Server application. React remains only as the UX reference
captured in the migration specification and Git history.

## Target Capabilities

- Identity login, logout, registration, password reset, and Merchant/Admin roles.
- Merchant company, address, and contact onboarding.
- Private KYC document upload and approval timeline.
- Admin application search, review, approval, rejection, and document requests.
- API key generation and rotation with one-time secret display.
- Dashboard statistics, approval funnel, pending work, and recent activity.

## Local Verification Constraint

The current workstation does not expose the `dotnet` CLI. Source and project
structure can be reviewed here, but restore, compile, EF migration generation,
and automated tests require a .NET 8 SDK installation.

