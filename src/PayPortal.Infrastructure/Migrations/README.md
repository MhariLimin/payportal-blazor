# EF Core Migrations

`InitialCreate` is the generated MySQL schema migration. Create future
migrations with:

```powershell
$env:PAYPORTAL_CONNECTION="Server=localhost;Port=3306;Database=payportal;User=payportal;Password=change-me"
dotnet tool restore
dotnet ef migrations add <MigrationName> --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
dotnet ef database update --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web
```

Do not hand edit provider annotations or the generated model snapshot.
