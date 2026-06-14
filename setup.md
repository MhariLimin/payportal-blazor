# Run PayPortal Locally

## Recommended .NET Approach

PayPortal uses native ASP.NET Core configuration:

- `appsettings.json` for shared non-secret settings.
- `appsettings.Development.json` for local development defaults.
- .NET User Secrets for the local administrator credentials.
- Environment variables or a production secret manager when deployed.

No `.env` file or dotenv loader is required.

## Prerequisites

1. Install the .NET 8 SDK.
2. Install and start Docker Desktop.
3. Open a new PowerShell window after installing .NET.

```powershell
dotnet --version
docker version
```

## First Run

```powershell
cd "D:\Mhari\Projects\C# Projects\PayPortal"
.\scripts\run-local.ps1
```

On the first run, the script prompts for an administrator email and password.
It stores them outside the repository using:

```powershell
dotnet user-secrets
```

The script then starts MySQL, restores dependencies, builds, and runs PayPortal.
Open `http://localhost:5088`.

## Later Runs

```powershell
.\scripts\run-local.ps1 -SkipRestore
```

Reconfigure the administrator seed secrets:

```powershell
.\scripts\run-local.ps1 -SkipRestore -ConfigureAdminSecrets
```

Seed secrets create the administrator when the database is empty. Changing
them does not rename or reset an administrator already stored in MySQL. Use the
password-reset UI or reset the local database when testing a new seed account.

Use an existing MySQL server:

```powershell
.\scripts\run-local.ps1 -SkipDocker
```

Build without starting the app:

```powershell
.\scripts\run-local.ps1 -SkipDocker -SkipRestore -BuildOnly -Configuration Release
```

## Inspect or Change User Secrets

```powershell
dotnet user-secrets list --project src/PayPortal.Web
dotnet user-secrets set "SeedAdmin:Email" "admin@payportal.local" --project src/PayPortal.Web
dotnet user-secrets set "SeedAdmin:Password" "ChangeThis123!" --project src/PayPortal.Web
```

User Secrets are intended for development only. They are stored under your user
profile, outside Git, and are loaded automatically when the environment is
Development.

## Stop

Press `Ctrl+C` to stop PayPortal, then:

```powershell
docker compose stop mysql
```

Delete the local database only when a clean reset is required:

```powershell
docker compose down -v
```
