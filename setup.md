# Run PayPortal Locally

## Prerequisites

1. Install the .NET 8 SDK.
2. Install and start Docker Desktop.
3. Open a new PowerShell window after installing .NET.

Confirm the tools:

```powershell
dotnet --version
docker version
```

## First Run

```powershell
cd "D:\Mhari\Projects\C# Projects\PayPortal"
Copy-Item .env.example .env.local
.\scripts\run-local.ps1
```

The script:

1. Loads `.env.local` into the current application process.
2. Starts the MySQL Docker container and waits until it is healthy.
3. Restores .NET tools and NuGet packages.
4. Builds the solution.
5. Runs PayPortal.

Open `http://localhost:5088`.

Default local administrator credentials from `.env.example`:

```text
Email: admin@payportal.local
Password: ChangeThis123!
```

Change those values in `.env.local`. Never commit that file.

## Why `.env.local` Needs a Script

ASP.NET Core does not load `.env` files by default. It automatically reads:

- `appsettings.json`
- `appsettings.Development.json`
- process environment variables
- command-line arguments
- user secrets when configured

The launcher reads `.env.local` and converts each entry into a process
environment variable before starting ASP.NET Core. This provides `.env`-style
local configuration without adding a dotenv package to the application.

The double underscore maps nested configuration keys:

```text
SeedAdmin__Email -> SeedAdmin:Email
ConnectionStrings__PayPortal -> ConnectionStrings:PayPortal
```

For normal .NET development, `dotnet user-secrets` is another good option.

## Later Runs

```powershell
.\scripts\run-local.ps1 -SkipRestore
```

Use `-SkipDocker` if MySQL is already running outside Docker:

```powershell
.\scripts\run-local.ps1 -SkipDocker
```

Build without starting the web host:

```powershell
.\scripts\run-local.ps1 -SkipDocker -SkipRestore -BuildOnly -Configuration Release
```

## Stop

Press `Ctrl+C` to stop PayPortal. Stop MySQL separately:

```powershell
docker compose stop mysql
```

Delete the local database and volume only when you want a clean reset:

```powershell
docker compose down -v
```
