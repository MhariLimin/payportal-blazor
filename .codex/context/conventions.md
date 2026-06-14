# Repository Conventions

## Commands

- `.\scripts\run-local.ps1`: load `.env.local`, start MySQL, build, and run.
- `dotnet restore PayPortal.sln`
- `dotnet build PayPortal.sln --no-restore`
- `dotnet test PayPortal.sln --no-build`
- `dotnet ef migrations add <Name> --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web`
- `dotnet ef database update --project src/PayPortal.Infrastructure --startup-project src/PayPortal.Web`
- `dotnet run --project src/PayPortal.Web`

## C# Rules

- Nullable reference types and implicit usings stay enabled.
- Domain entities own state; UI components do not query EF Core directly.
- Application services enforce ownership and role-sensitive workflows.
- Async methods accept `CancellationToken`.
- Use UTC timestamps and `Guid` identifiers.
- Keep secrets, file bytes, and password values out of logs.

## Blazor Rules

- Pages use real routes and `[Authorize]` declarations.
- Preserve loading, empty, validation, error, and success states.
- Use `AuthorizeView` for presentation only, never as the sole authorization
  control.
- Keep account pages statically rendered when a response cookie must be set.

## Git

- Use one-line Conventional Commit subjects.
- Commit as `MhariLimin <mhariallen.limin@gmail.com>`.
- Keep generated artifacts and secrets out of source control.
