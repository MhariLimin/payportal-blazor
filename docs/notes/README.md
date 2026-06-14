# PayPortal Beginner Notes

These notes explain PayPortal from the ground up. You do not need previous C#,
.NET, ASP.NET Core, or Blazor experience.

Read them in this order:

1. [The Big Picture](01-big-picture.md)
2. [C# and .NET Basics](02-csharp-and-dotnet.md)
3. [Solution and Clean Architecture](03-solution-architecture.md)
4. [ASP.NET Core and Program.cs](04-aspnet-core.md)
5. [Blazor and the UI](05-blazor.md)
6. [Database and EF Core](06-database-and-ef-core.md)
7. [Authentication and Authorization](07-authentication-and-roles.md)
8. [Configuration and Secrets](08-configuration-and-secrets.md)
9. [Build and Run](buildandrun.md)
10. [Follow One Feature End to End](10-feature-walkthrough.md)
11. [Glossary and Interview Answers](11-glossary-and-interview.md)

## One-Sentence Project Summary

PayPortal is a server-side .NET web application where merchants submit company
and KYC information, administrators review applications, and approved merchants
generate API credentials.

## The Main Mental Model

```text
Browser
  |
  v
Blazor pages in PayPortal.Web
  |
  v
Application service interfaces
  |
  v
Infrastructure service implementations
  |
  v
EF Core
  |
  v
MySQL database
```

Do not try to memorize everything. First understand what responsibility each
part has and how data moves between them.
