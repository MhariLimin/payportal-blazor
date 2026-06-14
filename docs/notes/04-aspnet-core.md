# 4. ASP.NET Core and Program.cs

## What Is ASP.NET Core?

ASP.NET Core is the .NET web framework.

It provides:

- A web server.
- HTTP request handling.
- Dependency injection.
- Configuration.
- Authentication and authorization.
- Logging.
- Middleware.
- Blazor hosting.

## Program.cs Is the Starting Point

PayPortal starts in:

```text
src/PayPortal.Web/Program.cs
```

The first important line is:

```csharp
var builder = WebApplication.CreateBuilder(args);
```

This creates the application builder and automatically prepares:

- Configuration.
- Logging.
- Dependency injection.
- Environment information.

## Registering Services

Before the app starts, services are registered:

```csharp
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();
```

This enables Blazor components.

```csharp
builder.Services.AddAuthentication(...)
    .AddIdentityCookies();
```

This enables login cookies.

```csharp
builder.Services.AddAuthorization();
```

This enables role and policy checks.

```csharp
builder.Services.AddInfrastructure(...);
```

This registers PayPortal's database, Identity, repositories, services, file
storage, and secret generation.

## Building the App

```csharp
var app = builder.Build();
```

Before this line, you are configuring services.

After this line, you are configuring how HTTP requests travel through the app.

## Middleware

Middleware is a chain of steps that handles each HTTP request.

```csharp
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseAntiforgery();
app.UseAuthentication();
app.UseAuthorization();
```

Simplified request path:

```text
Incoming request
  |
  +-- redirect to HTTPS when configured
  +-- serve CSS/static files
  +-- protect forms against forged requests
  +-- identify the signed-in user
  +-- check access permissions
  +-- route to a Blazor page or endpoint
```

Order matters. Authentication must happen before authorization can check the
user.

## Mapping Endpoints

Logout is mapped as a POST endpoint:

```csharp
app.MapPost("/account/logout", ...)
    .RequireAuthorization();
```

Blazor pages are mapped here:

```csharp
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();
```

## Database Startup Work

Before the server finishes starting:

```csharp
await DatabaseSeeder.SeedAsync(app.Services);
```

This:

1. Applies EF Core migrations.
2. Creates Merchant and Admin roles.
3. Creates the configured local admin if it does not exist.

## Starting the Server

```csharp
await app.RunAsync();
```

This keeps the web server running and listening for requests.

## Simple Interview Explanation

> Program.cs is the composition root. It loads configuration, registers Blazor,
> Identity, authorization, infrastructure services, and middleware. It then
> applies database startup tasks, maps endpoints, and starts the ASP.NET Core
> web server.
