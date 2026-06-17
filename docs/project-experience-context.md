# PayPortal Project and Tech Stack Experience Context

Use this as a personal context when explaining PayPortal in an interview,
portfolio, resume discussion, or job application.

## Short Project Summary

PayPortal is a merchant onboarding and payment operations portal built with
C#, ASP.NET Core 8, Blazor Server, Entity Framework Core, MySQL, and ASP.NET
Core Identity.

The application helps merchants register their company, complete profile
information, upload KYC documents, track approval progress, receive reviewer
requests, and manage API credentials after approval. Admin users can review
merchant applications, verify or reject individual documents, complete
compliance review, approve or reject applications, inspect merchant activity,
monitor risk, and view operational reports.

## How I Would Explain My Experience

I have hands-on project experience building a full-stack ASP.NET Core and
Blazor Server application through PayPortal. In this project, I worked with
C# across multiple layers of a Clean Architecture solution: domain entities,
application service contracts, infrastructure services, EF Core persistence,
Identity authentication, and Blazor UI pages.

This project gave me practical experience with how a real .NET web application
is structured, how data flows from the UI to services and into the database,
and how authentication, authorization, database access, file uploads, and
role-based workflows work together in ASP.NET Core.

## Tech Stack Used

- C#
- .NET 8
- ASP.NET Core 8
- Blazor Server / Interactive Server rendering
- Razor components
- Entity Framework Core
- Pomelo EF Core provider for MySQL
- MySQL
- ASP.NET Core Identity
- Clean Architecture
- Repository Pattern
- Service Layer
- Dependency Injection
- Docker / Docker Compose for local MySQL
- ASP.NET Core User Secrets for local development secrets

## C# Experience From This Project

In PayPortal, C# is used for the core application logic. I worked with:

- Entity classes such as merchants, contacts, addresses, KYC documents, reviews,
  API credentials, and activity records.
- Enums for statuses such as merchant status, risk level, document status, and
  review decisions.
- Service interfaces and implementations for merchant workflows, KYC uploads,
  admin reviews, credentials, and activity logs.
- Async code with `Task`, `async`, and `await` for database and file operations.
- Validation models using data annotations such as `Required`, `StringLength`,
  `EmailAddress`, `Phone`, and `Range`.
- Dependency injection to provide services to Blazor pages and infrastructure
  classes.

## ASP.NET Core Experience From This Project

PayPortal uses ASP.NET Core as the web application host. Through this project,
I worked with:

- Application startup and service registration in `Program.cs`.
- Middleware for authentication, authorization, antiforgery, and static files.
- ASP.NET Core configuration through `appsettings`, environment variables, and
  User Secrets.
- Route protection using role-based authorization.
- Secure local development setup with a script that starts MySQL, restores
  tools, builds the solution, and runs the app.

## Blazor Server Experience From This Project

The UI is built with Blazor Server using Razor components. I worked with:

- Routed `.razor` pages for dashboards, merchant profile, KYC verification,
  applications, activity, reports, API credentials, and admin settings.
- Interactive UI events using C# methods instead of JavaScript SPA logic.
- Forms using `EditForm`, `InputText`, `InputSelect`, `InputFile`,
  `InputNumber`, validation messages, and submit handlers.
- Role-specific navigation for Merchant and Admin users.
- Modals, dropdowns, notification popovers, grouped sidebar menus, and dark/light
  theme behavior.
- File upload workflows for KYC documents and company logos.

## Entity Framework Core and MySQL Experience

PayPortal uses EF Core Code First with MySQL. In this project, I worked with:

- A `PortalDbContext` that includes Identity tables and business tables.
- Entity relationships such as Merchant to Contacts, Addresses, KYC Documents,
  Reviews, API Credentials, Webhooks, and Activity Entries.
- EF Core query patterns using `Include`, `AsNoTracking`, filters, ordering,
  and async execution.
- Code First migrations for the initial schema and merchant logo support.
- MySQL as the persistent relational database.
- Docker Compose to run a local MySQL 8 database during development.

## ASP.NET Core Identity Experience

PayPortal uses ASP.NET Core Identity for authentication and roles. I worked with:

- Login, logout, registration, and password reset pages.
- Merchant and Admin roles.
- Role-protected Blazor routes.
- Service-level ownership checks so merchants can only access their own
  merchant record.
- Seeded local admin credentials using ASP.NET Core User Secrets.
- Identity cookies and password hashing through the standard ASP.NET Core
  Identity system.

## Clean Architecture Experience

PayPortal is organized into four main projects:

- `PayPortal.Domain`: business entities, enums, and shared domain objects.
- `PayPortal.Application`: service contracts, repository contracts, and models.
- `PayPortal.Infrastructure`: EF Core, Identity, repositories, storage, seeded
  data, and service implementations.
- `PayPortal.Web`: Blazor pages, layouts, account pages, static assets, and
  application startup.

This structure helped me understand how Clean Architecture separates business
rules from UI, database, file storage, and framework-specific code.

## Features I Can Talk About

- Merchant registration with company, contact, address, business type, industry,
  tax ID, and login credentials.
- Merchant profile editing and company logo upload.
- KYC document upload, document requirements, resubmission, and rejected
  document handling.
- Admin application review with approve, reject, request documents, and
  compliance review actions.
- Admin verification or rejection of individual KYC documents.
- Role-specific dashboards for merchants and admins.
- API credential generation and rotation after approval.
- Activity logs and merchant-specific notifications.
- Risk rules, API usage, reports, and admin settings pages.
- Theme switching with Light, Dark, and System options.
- Local setup automation with PowerShell, Docker, MySQL, .NET tools, and User
  Secrets.

## Interview-Ready Explanation

PayPortal is a merchant onboarding portal I built using the Microsoft .NET
stack. It uses ASP.NET Core 8 and Blazor Server for the web application, C# for
business logic, EF Core with MySQL for persistence, and ASP.NET Core Identity
for authentication and roles.

The project follows Clean Architecture, so the domain models and application
contracts are separated from infrastructure and UI concerns. Merchants can
register, edit their profile, upload KYC documents, respond to document
requests, and manage API credentials after approval. Admin users can review
applications, verify documents, complete compliance review, approve or reject
merchants, and monitor activity and reports.

Through this project, I gained practical experience building Blazor components,
handling forms and file uploads, using dependency injection, working with EF
Core relationships and migrations, implementing role-based authorization, and
organizing a .NET application into clean layers.

## Short Resume-Style Version

Built PayPortal, a merchant onboarding and payment operations portal using
ASP.NET Core 8, Blazor Server, C#, EF Core, MySQL, and ASP.NET Core Identity.
Implemented merchant registration, profile editing, KYC document uploads,
admin review workflows, role-based authorization, API credential management,
activity logs, notifications, risk monitoring, and reporting using Clean
Architecture, repository/service layers, dependency injection, and Docker-based
local MySQL setup.
