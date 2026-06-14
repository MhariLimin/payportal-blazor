# Local Setup

## Configuration Choice

ASP.NET Core does not natively load `.env` or `.env.local`. Its standard local
configuration mechanisms are environment variables, user secrets, and
`appsettings.Development.json`.

PayPortal supports `.env.local` through `scripts/run-local.ps1`. The script
loads the file into process environment variables before starting the app. This
keeps local credentials out of Git and avoids adding a dotenv dependency to the
application runtime.

Copy the tracked template:

```powershell
Copy-Item .env.example .env.local
```

Configuration names use ASP.NET Core's double-underscore mapping:

```text
SeedAdmin__Email -> SeedAdmin:Email
SeedAdmin__Password -> SeedAdmin:Password
ConnectionStrings__PayPortal -> ConnectionStrings:PayPortal
```

## Prerequisites

- .NET 8 SDK
- Docker Desktop or an existing MySQL 8 server

After installing .NET, open a new PowerShell window and verify:

```powershell
dotnet --version
docker version
```

## One-Command Build and Run

```powershell
.\scripts\run-local.ps1
```

The launcher validates .NET, creates `.env.local` from `.env.example` when
missing, starts and waits for MySQL, restores dependencies, builds, and runs the
web project.

For repeat runs:

```powershell
.\scripts\run-local.ps1 -SkipRestore
```

For an existing non-Docker MySQL server:

```powershell
.\scripts\run-local.ps1 -SkipDocker
```

Build without starting the web host:

```powershell
.\scripts\run-local.ps1 -SkipDocker -SkipRestore -BuildOnly -Configuration Release
```

## Manual Commands

```powershell
docker compose up -d mysql
dotnet tool restore
dotnet restore PayPortal.sln --configfile NuGet.Config
dotnet build PayPortal.sln --no-restore
dotnet run --project src/PayPortal.Web --no-build
```

When running manually, PowerShell does not automatically load `.env.local`.
Either set the `$env:` values for that terminal session or use the launcher.

## Code First Migrations

```powershell
dotnet tool restore
dotnet ef migrations add <MigrationName> --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
dotnet ef database update --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
```

## Stop and Reset

```powershell
docker compose stop mysql
```

To delete the local database volume:

```powershell
docker compose down -v
```

## Production Changes

- Use a secret manager instead of `.env.local`.
- Use a TLS-enabled MySQL connection.
- Configure email delivery, object storage, malware scanning, backups, MFA,
  observability, CI, and deployment.
