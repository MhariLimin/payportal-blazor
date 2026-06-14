# Step-by-Step Implementation Plan

1. Inventory the React prototype and map each page to a routed Blazor component.
2. Establish Domain, Application, Infrastructure, and Web projects.
3. Model merchants, contacts, addresses, KYC, reviews, credentials, and activity.
4. Configure MySQL Code First mapping and Identity stores.
5. Seed Merchant/Admin roles and an optional environment-configured admin.
6. Implement static SSR login, registration, reset, and logout workflows.
7. Implement merchant ownership checks and profile routes.
8. Build the database-backed dashboard and application inventory.
9. Add private KYC upload validation, persistence, and status timeline.
10. Add cryptographic API credential issuance and rotation.
11. Add admin decisions, reviewer notes, status transitions, and activity logs.
12. Remove React, Vite, Supabase, and Node runtime artifacts.
13. Generate the initial EF migration and verify a warning-free .NET 8 build.
14. Add automated tests, production storage, email, MFA, CI, and deployment.
