# React to Blazor Migration Plan

## Page Mapping

1. `Login.tsx` becomes static SSR account pages backed by Identity endpoints.
2. `Layout.tsx` becomes `MainLayout.razor` and `NavMenu.razor`.
3. `Dashboard.tsx` becomes routed `Home.razor`, populated by dashboard services.
4. `Applications.tsx` becomes admin-only `Applications.razor`.
5. `MerchantProfile.tsx` becomes owner/admin profile routes.
6. `KYCVerification.tsx` becomes owner/admin KYC routes with `InputFile`.
7. `APICredentials.tsx` becomes an approved-merchant credential page.
8. `AdminReview.tsx` becomes an admin queue and review detail page.

## Workflow Mapping

- React local state becomes component state backed by application services.
- React sample arrays become MySQL rows seeded only in Development.
- Supabase calls and RLS are replaced by repositories plus service authorization.
- Browser-local demo identity becomes Identity cookies and role claims.
- Visual-only controls become service calls with validation and audit entries.
- Lucide SVG usage becomes accessible text/icon primitives without a JS package.

## Delivery Sequence

1. Establish solution boundaries and domain model.
2. Add EF Core, MySQL, Identity, repositories, and seed roles.
3. Implement account and merchant registration flows.
4. Implement merchant profile and dashboard.
5. Implement KYC uploads and review timeline.
6. Implement API credential issuance and rotation.
7. Implement admin list and review decisions.
8. Add documentation, tests, and run/build verification.

