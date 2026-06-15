# 9. Development Admin Bootstrap

## Goal

Make local startup non-interactive after the first setup while using native
ASP.NET Core configuration.

## Acceptance Criteria

- Existing User Secrets are reused without prompting.
- A missing local admin is generated automatically with a development-only
  email and strong random password.
- The generated password is shown once and stored through `dotnet user-secrets`.
- The script supports an explicit reset option.
- No password is committed to source control.

