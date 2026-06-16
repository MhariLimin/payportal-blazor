# PayPortal

PayPortal is a native ASP.NET Core 8 Blazor Server merchant onboarding portal.
It supports merchant registration, KYC uploads, application review, approval
tracking, secure API credential issuance, activity timelines, document request
workflows, risk rules, API usage reporting, and admin operations pages.

## Stack

- ASP.NET Core 8 and Blazor Interactive Server
- C# and Clean Architecture
- Entity Framework Core Code First
- MySQL through Pomelo
- ASP.NET Core Identity with Merchant and Admin roles

## Projects

- `PayPortal.Domain`: entities and enums
- `PayPortal.Application`: use-case and repository contracts
- `PayPortal.Infrastructure`: EF Core, Identity, storage, and services
- `PayPortal.Web`: Blazor pages, layouts, and application host

## Run

1. Install the .NET 8 SDK and Docker Desktop.
2. Run the launcher:

```powershell
.\scripts\run-local.ps1
```

On first run, the launcher prompts for local administrator credentials and
stores them with .NET User Secrets. Local non-secret settings use
`appsettings.Development.json`. See [setup](docs/setup.md).

## Verification

```powershell
dotnet build PayPortal.sln
dotnet ef migrations add InitialCreate --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
dotnet test PayPortal.sln
```

Verified with .NET SDK 8.0.422: restore, build, and initial EF migration
generation complete with zero build warnings. Local MySQL smoke tests cover
schema migration, role/admin seeding, account pages, admin login/dashboard, and
merchant registration.

## Documentation

- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Security](docs/security.md)
- [Implementation plan](docs/implementation-plan.md)
- [Demo guide](docs/demo-guide.md)
- [Feature and UI testing](docs/feature-testing-guide.md)
- [Post Implementation Feedback 4](docs/post-implementation-feedback-4.md)
- [Logo generation prompt](docs/logo-generation-prompt.md)
- [Setup](docs/setup.md)
