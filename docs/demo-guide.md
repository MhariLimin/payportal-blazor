# Interview Demo Guide

## Thirty-Second Summary

PayPortal is a merchant onboarding system rebuilt from a visual React prototype
as a native Blazor Server application. I used Clean Architecture to separate
domain rules from EF Core, Identity, MySQL, file storage, and UI concerns.

## Suggested Demo

1. Register a merchant and point out that registration creates the Identity
   user, Merchant role, company profile, address, contact, and milestones.
2. Open the dashboard and explain that statistics now come from MySQL rather
   than sample arrays.
3. Open the merchant profile and show owner-scoped data.
4. Upload a KYC document and explain private storage, generated filenames,
   content-type/size validation, and audit activity.
5. Sign in as Admin, filter applications, and submit a review decision.
6. Return to the merchant KYC timeline to show reviewer notes and status.
7. Approve the merchant, create an API key, and emphasize that the secret is
   cryptographically generated, hashed at rest, and displayed only once.
8. Rotate the key to demonstrate revocation and audit behavior.

## Architecture Talking Points

- Blazor Server provides a rich UI without retaining the React SPA runtime.
- Static SSR is intentionally used for cookie-writing Identity flows.
- Service-layer authorization prevents cross-merchant access even if a route is
  manipulated.
- EF Core mappings and migrations keep the schema versioned with the code.
- Infrastructure abstractions allow local KYC storage to be replaced by S3 or
  Azure Blob Storage without changing pages or domain entities.

## Honest Limitations

- Development reset links are displayed instead of emailed.
- Local storage should be replaced with encrypted object storage and malware
  scanning.
- Automated test coverage and production deployment configuration remain next
  steps; the solution build and initial EF migration are verified.
