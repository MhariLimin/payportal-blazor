# Local Setup

## Prerequisites

- .NET 8 SDK
- Docker Desktop or MySQL 8
- Optional: `dotnet-ef`

## Database

```powershell
docker compose up -d mysql
```

The committed development connection string matches the Docker Compose service.
Use environment variables for any non-local environment:

```powershell
$env:ConnectionStrings__PayPortal="Server=host;Port=3306;Database=payportal;User=user;Password=secret"
$env:SeedAdmin__Email="admin@example.com"
$env:SeedAdmin__Password="StrongPassword123!"
```

## Build and Run

```powershell
dotnet restore PayPortal.sln
dotnet build PayPortal.sln --no-restore
dotnet run --project src/PayPortal.Web
```

## Code First Migration

```powershell
dotnet tool install --global dotnet-ef
$env:PAYPORTAL_CONNECTION=$env:ConnectionStrings__PayPortal
dotnet ef migrations add InitialCreate --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
dotnet ef database update --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
```

## Production Changes

- Remove the committed local-only password from `appsettings.json`.
- Use a secret store and TLS-enabled MySQL connection.
- Disable `EnsureCreated` fallback after the first migration is committed.
- Configure email delivery, object storage, scanning, backups, and observability.
