# 2. C# and .NET Basics

## C# Is the Language

C# is the language used to write most PayPortal code.

Example:

```csharp
public sealed class Merchant
{
    public Guid Id { get; set; }
    public required string CompanyName { get; set; }
}
```

This defines a type named `Merchant`.

- `public` means other code can use it.
- `class` defines an object type.
- `Guid` is a unique identifier.
- `string` stores text.
- `{ get; set; }` creates a readable and writable property.
- `required` means a value must be supplied when creating the object.

## .NET Is the Platform

.NET provides:

- The runtime that executes compiled C#.
- Built-in libraries.
- The `dotnet` command-line tool.
- Project and package management.
- Web, database, security, and testing frameworks.

The project targets .NET 8 in `Directory.Build.props`:

```xml
<TargetFramework>net8.0</TargetFramework>
```

## Important C# Concepts Used Here

### Namespace

A namespace groups related classes and avoids naming conflicts.

```csharp
namespace PayPortal.Domain.Entities;
```

### Interface

An interface describes a contract without choosing an implementation.

```csharp
public interface IMerchantService
{
    Task<Merchant?> GetAccessibleAsync(Guid? merchantId);
}
```

This says that a merchant service must provide that operation.

Infrastructure later supplies the actual `MerchantService` implementation.

### Dependency Injection

Instead of a class creating its own dependencies, ASP.NET Core gives them to
the class.

```csharp
internal sealed class MerchantService(
    IMerchantRepository merchants,
    ICurrentUser currentUser)
```

`MerchantService` needs a repository and current user. It does not construct
them itself.

Benefits:

- Components are easier to replace.
- Code is easier to test.
- Responsibilities stay separated.

### Async and Task

Database and file operations take time. C# uses `async` and `Task` so the server
does not block while waiting.

```csharp
public async Task<Merchant?> GetAsync(Guid id)
{
    return await dbContext.Merchants.FindAsync(id);
}
```

### Nullable Values

`Merchant?` means the result may be a Merchant or `null`.

```csharp
Merchant? merchant
```

PayPortal enables nullable checking:

```xml
<Nullable>enable</Nullable>
```

The compiler warns when code may incorrectly use a missing value.

### Enums

An enum provides a fixed set of named values:

```csharp
public enum MerchantStatus
{
    Draft,
    Pending,
    UnderReview,
    Approved,
    Rejected
}
```

This is safer than passing arbitrary status text everywhere.

## What Compilation Means

C# source files are not directly executed by the browser.

```text
.cs and .razor source files
          |
          v
dotnet build
          |
          v
compiled .NET assemblies such as PayPortal.Web.dll
          |
          v
.NET runtime executes the assemblies
```

## Simple Interview Explanation

> C# is the language, while .NET 8 is the runtime and application platform. The
> code uses interfaces and dependency injection to separate contracts from
> implementations, async methods for database and file operations, and nullable
> checking to catch missing-value mistakes during compilation.
