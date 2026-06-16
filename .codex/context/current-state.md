# Current State

## Migration

The Bolt-generated React/Vite/Supabase prototype has been replaced by a native
ASP.NET Core 8 Blazor Server application. React remains only as the UX reference
captured in the migration specification and Git history.

## Target Capabilities

- Identity login, logout, registration, password reset, and Merchant/Admin roles.
- Merchant company, address, and contact onboarding.
- Private KYC document upload and approval timeline.
- Admin application search, review, approval, rejection, and document requests.
- API key generation and rotation with one-time secret display.
- Dashboard statistics, approval funnel, pending work, and recent activity.
- Role-specific dashboards: admins see portfolio charts and review workload,
  while merchants see onboarding progress, documents, next steps, and account
  readiness.
- Admin dashboard charts drill into filtered Merchant Directory views.
- Editable merchant profiles and private company-logo uploads.
- Functional KYC milestones and authorized document downloads.
- Admins can verify or reject individual KYC documents and complete Compliance
  Review separately from final approval.
- New registrations leave the company profile milestone pending until the
  merchant saves the editable profile.
- KYC document requirements are grouped with matching uploads in the main KYC
  document card.
- Merchant-aware activity descriptions, admin activity filters, merchant
  notifications, application audit logs, and detail breadcrumbs.
- PayPortal branding with persistent light, dark, and system themes.

## Verification

- .NET SDK 8.0.422 installed.
- Solution restore succeeds.
- Solution build succeeds with zero warnings and errors.
- Initial MySQL EF Core migration generated.
- Merchant-logo migration generated and applied to local MySQL.
- MySQL migration application, role/admin seeding, anonymous account routes,
  authenticated admin dashboard, and merchant registration smoke tests pass.
- Solution build succeeds with zero warnings and errors after feedback work.
- Registration fields/options, static brand assets, protected redirects,
  authenticated admin filters, and role-specific navigation are route tested.
- Feedback 3 UI density, admin page split, document review, compliance review,
  activity filters, notifications, drill-downs, and audit logs are implemented.
- Automated tests remain future work.
