# EF Core Migrations

Generate the initial migration after installing the .NET 8 SDK and EF tool:

```powershell
dotnet tool install --global dotnet-ef
$env:PAYPORTAL_CONNECTION="Server=localhost;Port=3306;Database=payportal;User=payportal;Password=change-me"
dotnet ef migrations add InitialCreate --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
dotnet ef database update --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
```

Migration source is intentionally generated from `PortalDbContext`; do not hand
edit provider annotations or the model snapshot.
