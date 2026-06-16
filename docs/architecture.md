# Architecture

PayPortal uses Clean Architecture so business rules do not depend on Blazor,
Identity, EF Core, or MySQL.

## Dependency Direction

```text
PayPortal.Web ----------> PayPortal.Application <---------- PayPortal.Infrastructure
                                  |
                                  v
                           PayPortal.Domain
```

- Domain contains merchant, KYC, review, credential, webhook, and activity
  entities.
- Application defines repository, current-user, storage, and use-case contracts.
- Infrastructure implements those contracts with EF Core, Identity, local
  private storage, and cryptographic APIs.
- Web composes the system and renders routed Blazor components.

## Request Flow

1. A Blazor page calls an application service interface.
2. The service checks the authenticated user and merchant ownership.
3. A repository or `PortalDbContext` loads and changes entities.
4. EF Core commits the unit of work to MySQL.
5. Sensitive actions append an `ActivityEntry`.

## Rendering

Account forms use static server rendering because Identity must set cookies in
an HTTP response. Authenticated pages use Interactive Server rendering for
filters, uploads, dialogs, and review actions without a JavaScript SPA.

## Route Roles

- Admin review work happens in `Applications`; Merchant Directory is read-only
  inspection and filtering.
- Merchant notifications are opened from the top-right notification icon as a
  modal.
- Merchant Profile is in the top-right account dropdown for merchants and is
  still inspectable by admins through `/merchants/{id}`.
- Merchant activity moved to `My Activity`; admin activity remains the
  portal-wide `Activity` page.
- Operations pages cover Risk Rules, Document Requests, Timeline, API Usage,
  Admin Settings, and Reports.

## Patterns

- Repository Pattern: merchant and activity persistence contracts.
- Service Layer: dashboard, KYC, credential, registration, and review use cases.
- Dependency Injection: all infrastructure is registered in one composition
  extension.
- Unit of Work: scoped `PortalDbContext` transactions.
