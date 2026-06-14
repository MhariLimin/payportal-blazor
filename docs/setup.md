# Local Setup

## Configuration Model

PayPortal follows ASP.NET Core's native layered configuration model.

1. `appsettings.json` provides shared defaults.
2. `appsettings.Development.json` provides local, non-secret development values
   such as the Docker MySQL connection.
3. .NET User Secrets hold developer-specific administrator credentials.
4. Environment variables or a managed secret store override settings in hosted
   environments.
5. Command-line arguments have the highest normal precedence.

This avoids a dotenv parser and matches common C# and ASP.NET Core development
workflows.

## Why User Secrets

The Web project declares a `UserSecretsId`. When ASP.NET Core runs in the
Development environment, `WebApplication.CreateBuilder` automatically loads
the associated secrets from the current user's profile.

User Secrets:

- Are outside the repository.
- Are not committed to Git.
- Are loaded through the standard ASP.NET Core configuration pipeline.
- Are appropriate for development, not encrypted production storage.

## Prerequisites

- .NET 8 SDK
- Docker Desktop or an existing MySQL 8 server

```powershell
dotnet --version
docker version
```

## One-Command Build and Run

```powershell
.\scripts\run-local.ps1
```

On first run, the launcher prompts for administrator credentials and stores
them through `dotnet user-secrets`. It then starts and waits for MySQL, restores
packages and tools, builds the solution, and starts the Blazor application at
`http://localhost:5088`.

Useful options:

```powershell
.\scripts\run-local.ps1 -SkipRestore
.\scripts\run-local.ps1 -SkipDocker
.\scripts\run-local.ps1 -ConfigureAdminSecrets
.\scripts\run-local.ps1 -SkipDocker -SkipRestore -BuildOnly -Configuration Release
```

Seed secrets are used when creating an administrator in an empty database.
Changing the secrets does not mutate an administrator already stored in MySQL.
Use the password-reset workflow or reset the local database for a new seed
identity.

## Manual User Secret Commands

```powershell
dotnet user-secrets list --project src/PayPortal.Web
dotnet user-secrets set "SeedAdmin:Email" "admin@payportal.local" --project src/PayPortal.Web
dotnet user-secrets set "SeedAdmin:Password" "ChangeThis123!" --project src/PayPortal.Web
```

## Manual Build and Run

```powershell
docker compose up -d mysql
dotnet tool restore
dotnet restore PayPortal.sln --configfile NuGet.Config
dotnet build PayPortal.sln --no-restore
dotnet run --project src/PayPortal.Web --no-build
```

`launchSettings.json` sets `ASPNETCORE_ENVIRONMENT=Development` and binds the
local application to `http://localhost:5088`.

## Configuration Precedence

If the same key exists in multiple sources, the later, higher-priority source
wins. For example, a deployment environment variable named
`ConnectionStrings__PayPortal` overrides both appsettings files.

The double underscore represents a nested configuration separator:

```text
ConnectionStrings__PayPortal -> ConnectionStrings:PayPortal
```

## Code First Migrations

```powershell
dotnet tool restore
dotnet ef migrations add <MigrationName> --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
dotnet ef database update --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
```

## Production Guidance

- Do not use User Secrets as a production secret store.
- Use environment variables, Azure Key Vault, AWS Secrets Manager, HashiCorp
  Vault, or the deployment platform's managed secrets.
- Use TLS for MySQL and configure production email, storage, scanning, backup,
  MFA, logging, and monitoring.
