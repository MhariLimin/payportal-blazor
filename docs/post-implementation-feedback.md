# Post-Implementation Feedback Guide

This document maps the requested feedback to the implemented behavior.

1. **Admin setup:** the launcher generates and stores a local admin credential
   once with User Secrets. Use `-ConfigureAdminSecrets` for a chosen credential
   or `-ResetAdminSecrets` to generate a replacement.
2. **Required fields:** registration labels show red required indicators.
3. **Profile editing:** merchants can edit company, contact, and address data.
4. **Company logo:** merchants can upload a private PNG/JPEG logo used in
   profiles, application rows, and the account menu.
5. **Spacing and text:** the shared visual system standardizes typography,
   spacing, title casing, forms, lists, and responsive behavior.
6. **KYC milestones:** required-document completion moves the application to
   Under Review. Compliance Review means an administrator checks the company
   and evidence; uploads correctly happen before that review.
7. **Admin activity:** dashboard entries identify the merchant and explain the
   action in readable language.
8. **Role navigation:** admins no longer see merchant-only profile, KYC, or API
   credential navigation.
9. **Registration and filters:** business type and industry use standard
   choices, and Admin Applications can filter by both.
10. **Themes:** Light, Dark, and System modes persist in browser storage.
11. **Document access:** authorized merchants and admins can view or download
    uploaded KYC evidence.
12. **Admin context:** merchant profile and KYC pages include breadcrumbs and
    back actions.
13. **Activity detail:** profile, logo, KYC, review, and credential activity
    uses specific titles and descriptions.
14. **Header utility:** the nonfunctional search placeholder was replaced by
    workspace and security context.
15. **Application branding:** the supplied PayPortal artwork is included in
    account and application layouts.
16. **Account dropdown:** theme selection and logout are grouped under the
    top-right user/company icon.
17. **UI redesign:** logo-derived cyan, blue, teal, and navy colors now drive a
    responsive branded interface with improved cards, dialogs, forms, lists,
    navigation, and typography.

## KYC Progress Rules

- Company profile completion: completed during registration.
- Required documents: completed after incorporation, tax, and director ID
  evidence have all been uploaded.
- Compliance review: completed when an administrator approves or rejects the
  application.
- Application approval: completed only when the decision is Approved.

Requesting more information returns the application to Pending and keeps review
and approval milestones incomplete.
