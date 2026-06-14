# 9. Build and Run PayPortal

## The Short Version

Open PowerShell in the repository and run:

```powershell
.\scripts\run-local.ps1
```

On the first run, enter a local administrator email and password when asked.

Then open:

```text
http://localhost:5088
```

## What the Script Does

### 1. Checks the .NET SDK

The script checks that `dotnet` exists and that the installed SDK is version 8.

```powershell
dotnet --version
```

The SDK contains the compiler, build tools, templates, and CLI.

### 2. Starts MySQL

```powershell
docker compose up -d mysql
```

Docker reads `docker-compose.yml` and starts a MySQL 8 container.

`-d` means it runs in the background.

### 3. Waits for MySQL

Starting a container does not mean MySQL is immediately ready.

The script checks Docker's health status until MySQL can accept connections.

### 4. Restores Tools

```powershell
dotnet tool restore
```

This installs repository tools listed in `.config/dotnet-tools.json`, including
the EF Core command-line tool.

### 5. Restores NuGet Packages

```powershell
dotnet restore PayPortal.sln --configfile NuGet.Config
```

NuGet is the .NET package manager.

Restore downloads libraries such as:

- EF Core.
- Pomelo's MySQL provider.
- Identity EF integration.

This is similar to installing dependencies in other ecosystems.

### 6. Configures User Secrets

On the first normal run, the script checks:

```powershell
dotnet user-secrets list --project src/PayPortal.Web
```

If admin secrets are missing, it asks for them and stores them outside Git.

### 7. Builds the Solution

```powershell
dotnet build PayPortal.sln --no-restore
```

Build performs:

1. C# compilation.
2. Razor component compilation.
3. Project reference checking.
4. NuGet dependency checking.
5. Output generation under `bin/`.

The projects build in dependency order:

```text
Domain
  |
  v
Application
  |
  v
Infrastructure
  |
  v
Web
```

`TreatWarningsAsErrors` is enabled, so compiler warnings fail the build. This
encourages cleaner code.

### 8. Runs the Web Project

```powershell
dotnet run --project src/PayPortal.Web --no-build
```

Only `PayPortal.Web` is executable. The other projects are class libraries used
by Web.

### 9. ASP.NET Core Loads Configuration

Because `launchSettings.json` sets Development mode, configuration is combined
from:

1. `appsettings.json`
2. `appsettings.Development.json`
3. User Secrets
4. Environment variables
5. Command-line arguments

### 10. Database Startup Runs

`DatabaseSeeder`:

1. Connects to MySQL.
2. Applies migrations.
3. Creates Merchant and Admin roles.
4. Creates the configured administrator if missing.

### 11. The Server Starts

ASP.NET Core listens at:

```text
http://localhost:5088
```

The browser can now request the login page.

## Useful Script Options

Skip package restore on later runs:

```powershell
.\scripts\run-local.ps1 -SkipRestore
```

Use an already-running MySQL server:

```powershell
.\scripts\run-local.ps1 -SkipDocker
```

Configure different admin seed secrets:

```powershell
.\scripts\run-local.ps1 -ConfigureAdminSecrets
```

Build without running:

```powershell
.\scripts\run-local.ps1 -SkipDocker -SkipRestore -BuildOnly -Configuration Release
```

## Debug vs Release

### Debug

- Default during development.
- Easier debugging.
- Less optimized.

### Release

- Optimized output.
- Used for deployment builds.
- Useful for final verification.

## Stopping the App

Press:

```text
Ctrl+C
```

Then stop MySQL:

```powershell
docker compose stop mysql
```

This preserves the database volume.

To delete all local database data:

```powershell
docker compose down -v
```

## Common Errors

### dotnet is not recognized

Open a new PowerShell window after installing .NET.

Check:

```powershell
dotnet --version
```

### Docker Desktop is not running

Start Docker Desktop, wait for the engine, and rerun the script.

### Port 5088 is already in use

Another PayPortal process may already be running. Stop it with `Ctrl+C` in its
terminal.

### Build says the executable is locked

The app is currently running. Stop it before rebuilding the same configuration.

## Simple Interview Explanation

> The launcher validates .NET, starts a healthy MySQL container, restores local
> tools and NuGet packages, configures development User Secrets, builds the
> four-project solution, and runs the Web project. ASP.NET Core then loads
> layered configuration, applies EF migrations, seeds Identity roles, and starts
> the Blazor Web App using Interactive Server rendering.
