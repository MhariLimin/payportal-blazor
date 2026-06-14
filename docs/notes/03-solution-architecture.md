# 3. Solution and Clean Architecture

## Solution vs Project

`PayPortal.sln` is the **solution**. It groups several related .NET projects.

Each `.csproj` file defines one project.

```text
PayPortal.sln
  |
  +-- PayPortal.Domain.csproj
  +-- PayPortal.Application.csproj
  +-- PayPortal.Infrastructure.csproj
  +-- PayPortal.Web.csproj
```

Building the solution builds all four projects.

## Why Split the Code?

Imagine putting UI code, database code, passwords, and business rules into one
large file. A small change could accidentally affect everything.

Clean Architecture creates boundaries.

```text
Web -------------> Application <------------- Infrastructure
                         |
                         v
                       Domain
```

Dependencies should point toward the business center.

## Domain Project

Location:

```text
src/PayPortal.Domain
```

Contains:

- `Merchant`
- `MerchantContact`
- `MerchantAddress`
- `KycDocument`
- `ApplicationReview`
- `ApiCredential`
- Status and risk enums

The Domain project should not know about:

- Blazor pages
- MySQL
- EF Core
- HTTP
- Docker

It describes the business data and rules.

## Application Project

Location:

```text
src/PayPortal.Application
```

Contains contracts such as:

- `IMerchantService`
- `IKycService`
- `ICredentialService`
- `IMerchantRepository`
- `IFileStorage`

It defines what the application can do, but not technical details such as how a
file is stored or how MySQL is queried.

## Infrastructure Project

Location:

```text
src/PayPortal.Infrastructure
```

Contains technical implementations:

- `PortalDbContext`
- EF Core repositories
- ASP.NET Core Identity setup
- MySQL configuration
- Local private file storage
- Secret generation
- Merchant, KYC, credential, and review services

Infrastructure answers questions such as:

- How do we save a merchant?
- How do we hash a secret?
- Where do KYC files go?
- How do we create roles?

## Web Project

Location:

```text
src/PayPortal.Web
```

Contains:

- `Program.cs`
- Blazor pages
- Layout and navigation
- CSS
- Account forms
- Configuration files

This is the executable project. Running it starts the web server.

## Example: Why an Interface Helps

The Application layer defines:

```csharp
public interface IFileStorage
{
    Task<string> SaveAsync(...);
}
```

Infrastructure implements it with local disk storage.

Later, the local implementation could be replaced with Azure Blob Storage or
Amazon S3 without rewriting the KYC page.

## A Practical Rule

When reading a file, ask:

```text
Is this business data?            -> Domain
Is this an operation contract?    -> Application
Is this a technical implementation? -> Infrastructure
Is this a page or web startup?    -> Web
```

## Simple Interview Explanation

> I split the solution into Domain, Application, Infrastructure, and Web
> projects. The Domain contains business objects, Application contains
> contracts, Infrastructure implements database and security concerns, and Web
> contains Blazor pages and application startup. This keeps business logic from
> depending directly on UI or database technology.
