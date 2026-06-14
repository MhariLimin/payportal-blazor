# 8. Configuration and Secrets

## What Is Configuration?

Configuration is information the application needs but should not always be
hard-coded in C#.

Examples:

- Database connection string.
- Local application URL.
- Logging level.
- Seed administrator email.
- Seed administrator password.

## PayPortal's Configuration Files

### appsettings.json

Location:

```text
src/PayPortal.Web/appsettings.json
```

Contains shared non-secret settings:

- Empty seed admin placeholders.
- Logging levels.
- Allowed hosts.

### appsettings.Development.json

Location:

```text
src/PayPortal.Web/appsettings.Development.json
```

Contains the local Docker MySQL connection string.

It is loaded only when the application environment is `Development`.

The local MySQL password is committed because it is only the disposable Docker
development credential, not a production secret.

### launchSettings.json

Location:

```text
src/PayPortal.Web/Properties/launchSettings.json
```

Used by local `dotnet run` and IDE launch profiles.

It sets:

- `ASPNETCORE_ENVIRONMENT=Development`
- Local URL `http://localhost:5088`

It is not normally used after publishing the application to a server.

## User Secrets

The Web project has:

```xml
<UserSecretsId>PayPortal-Local-Development</UserSecretsId>
```

This connects it to a secret file stored under your Windows user profile,
outside the Git repository.

Commands:

```powershell
dotnet user-secrets list --project src/PayPortal.Web
dotnet user-secrets set "SeedAdmin:Email" "admin@example.com" --project src/PayPortal.Web
dotnet user-secrets set "SeedAdmin:Password" "StrongPassword123!" --project src/PayPortal.Web
```

User Secrets are:

- Good for development.
- Automatically loaded in Development.
- Kept outside Git.
- Not intended as encrypted production secret storage.

## Configuration Key Syntax

In JSON:

```json
{
  "SeedAdmin": {
    "Email": "admin@example.com"
  }
}
```

In C#:

```csharp
configuration["SeedAdmin:Email"]
```

As an environment variable:

```text
SeedAdmin__Email
```

The double underscore represents a colon because some operating systems do not
support colons in environment variable names.

## Configuration Precedence

ASP.NET Core combines multiple sources.

Simplified order from lower priority to higher priority:

```text
appsettings.json
    |
    v
appsettings.Development.json
    |
    v
User Secrets in Development
    |
    v
Environment variables
    |
    v
Command-line arguments
```

If the same key appears twice, the higher-priority value wins.

Example:

```text
appsettings.Development.json says:
Database = local MySQL

Production environment variable says:
Database = production MySQL

Result in production:
production environment variable wins
```

## Why This Is Better Than a Custom .env Loader Here

`.env` is not bad, but ASP.NET Core does not load it by default.

The current approach:

- Uses built-in framework behavior.
- Requires no custom parser.
- Looks familiar to .NET developers.
- Separates shared, development, and production configuration.
- Uses native User Secrets for local sensitive values.

## Production Secrets

Production should not use:

- Committed passwords.
- User Secrets.
- Plaintext secrets in source control.

Typical production options:

- Environment variables managed by the hosting platform.
- Azure Key Vault.
- AWS Secrets Manager.
- HashiCorp Vault.
- Kubernetes Secrets with appropriate encryption and access controls.

## Simple Interview Explanation

> PayPortal uses ASP.NET Core's layered configuration. Shared settings are in
> appsettings.json, local non-secret values are in
> appsettings.Development.json, and developer credentials are stored with User
> Secrets outside Git. Production can override the same keys through environment
> variables or a managed secret store.
