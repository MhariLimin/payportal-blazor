# Post Implementation Feedback 5

Feedback 5 cleaned up navigation and moved document-request work closer to the
actual KYC workflow.

## Implemented

- Grouped Light, Dark, and System mode under a `Themes` section in the
  top-right user dropdown.
- Moved Admin Settings into the admin user dropdown.
- Removed unused header shortcut buttons.
- Replaced the merchant notification icon with a bell icon.
- Simplified the notification modal to action-required items only.
- Made the notification modal close by clicking outside it.
- Removed the separate Timeline page and renamed merchant `My Activity` to
  `Activity`.
- Removed merchant Document Requests from the sidebar.
- Added submit/resubmit actions directly inside KYC Document Requirements.
- Marked rejected documents visually and kept resubmission in the same
  requirement row.
- Grouped merchant API pages under an `API` workspace dropdown.
- Grouped admin onboarding pages under `Onboarding`.
- Grouped admin monitoring pages under `Monitoring`.
- Replaced the lower-left quick workspace card with role-specific next-action
  links.
- Changed admin Document Requests into merchant-grouped dropdown sections.

## Current Navigation

Merchant:

- Dashboard
- KYC Verification
- Activity
- API
- Profile from the user dropdown
- Themes and logout from the user dropdown

Admin:

- Dashboard
- Onboarding: Applications, Document Requests
- Merchant Directory
- Activity
- Monitoring: Risk Rules, API Usage, Reports
- Admin Settings, Themes, and logout from the user dropdown
