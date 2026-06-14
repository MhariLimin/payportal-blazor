# Codex Session Guide

Read this file first for project-shaped work in PayPortal.

## Load Order

1. Always read:
   - `.codex/context/product.md`
   - `.codex/context/current-state.md`
   - `.codex/context/architecture.md`
   - `.codex/context/conventions.md`
2. For planning, backlog, or feature work, also read:
   - `.codex/context/roadmap.md`
   - `.codex/specs/index.md`
3. For implementation, read only the matching file under
   `.codex/specs/active/`, `.codex/specs/pending/`, or
   `.codex/specs/resolved/`.

## Short Commands

- `load codex context`
- `do #1`
- `execute #1`
- `ship #1`

For numbered work, resolve the roadmap item, load its spec, implement and
verify it, and keep unrelated changes out of scope.

## Context Policy

- Keep durable rules in `.codex/context/`.
- Keep feature and bug notes in `.codex/specs/`.
- Promote started work to `active/` and shipped work to `resolved/`.
- Never store environment values, API secrets, or credentials in `.codex/`.

## Current Focus

The application is a native Blazor Server merchant-onboarding portal using
ASP.NET Core Identity, EF Core, and MySQL. The next work is automated test
coverage and production integrations for email, private object storage,
malware scanning, MFA, CI, and deployment.
