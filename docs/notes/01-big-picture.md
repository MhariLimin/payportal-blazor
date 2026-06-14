# 1. The Big Picture

## What Kind of Application Is PayPortal?

PayPortal is a web application.

That means:

- A browser displays the user interface.
- A web server receives browser requests.
- Server-side code performs business operations.
- A database saves information permanently.

PayPortal has two main user types:

- **Merchant**: registers a business, uploads KYC documents, checks approval
  status, and creates API credentials after approval.
- **Admin**: views merchant applications and approves, rejects, or requests
  more documents.

## How the Technologies Relate

The names can be confusing because they describe different levels.

```text
C#
  is the programming language

.NET 8
  is the platform and runtime that executes C#

ASP.NET Core
  is the .NET framework used to build web applications

Blazor
  is the ASP.NET Core UI framework used to build browser pages with C#

Entity Framework Core
  lets C# code read and write database records

MySQL
  is the database that stores the records

ASP.NET Core Identity
  manages users, passwords, login cookies, and roles
```

An analogy:

```text
C#                 = the language spoken by the workers
.NET                = the workplace and machinery
ASP.NET Core        = the web application department
Blazor              = the team building the screens
EF Core             = the translator talking to the database
MySQL               = the filing cabinet
Identity            = the security desk
```

## What Happens When You Open PayPortal?

1. The browser requests a page from ASP.NET Core.
2. ASP.NET Core checks whether the user is signed in.
3. A Blazor component builds the page.
4. The component calls a service when it needs data.
5. The service checks business and security rules.
6. EF Core reads the data from MySQL.
7. Blazor renders the result in the browser.

## Why There Are Four Projects

The code is separated so each part has one main responsibility:

| Project | Simple responsibility |
| --- | --- |
| `PayPortal.Domain` | Defines the business objects |
| `PayPortal.Application` | Defines what operations the app supports |
| `PayPortal.Infrastructure` | Implements database, security, files, and services |
| `PayPortal.Web` | Displays pages and starts the application |

This separation is called **Clean Architecture**.

## Simple Interview Explanation

> PayPortal is built with C# on .NET 8. ASP.NET Core hosts the web application,
> Blazor provides the interactive server-side UI, Identity manages login and
> roles, EF Core maps C# entities to MySQL, and Clean Architecture separates the
> business model from infrastructure and UI code.
