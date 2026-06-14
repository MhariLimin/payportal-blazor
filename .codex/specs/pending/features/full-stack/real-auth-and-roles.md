# Real Authentication and Roles

## Goal

Replace demo local-storage authentication with Supabase authentication and
trusted merchant, reviewer, and administrator profiles.

## Scope

- Define user profile and role tables.
- Implement session lifecycle, login, logout, and protected navigation.
- Remove demo password acceptance and local-storage identity trust.
- Define role assignment and administration rules.

## Verification

- Typecheck, lint, and build.
- Test unauthenticated access and each role's allowed screens and operations.
