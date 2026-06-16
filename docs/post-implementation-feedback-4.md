# Post Implementation Feedback 4

Feedback 4 added a more complete operations workspace around the merchant
onboarding workflow.

## Implemented

- Removed `Review` from Merchant Directory. All review actions now live in
  `Applications`.
- Replaced the merchant Notifications page with a top-right notification icon
  and modal.
- Moved Merchant Profile into the top-right account dropdown for merchants.
- Moved merchant recent activity out of the dashboard and removed duplicate
  audit history from Merchant Profile. Feedback 5 later renamed this to
  `Activity`.
- Added operational pages: `Risk Rules`, `Document Requests`, `Timeline`,
  `API Usage`, `Admin Settings`, and `Reports`. Feedback 5 later removed the
  separate Timeline page because it duplicated Activity.
- Added internal admin notes on Applications while hiding those notes from the
  merchant-facing KYC timeline.
- Added bulk selection/export messaging on Applications.
- Added demo file scan indicators before document review actions.
- Added risk scoring updates based on industry, business type, and rejected
  documents.
- Added useful header and lower-left workspace shortcuts.

## Demo Notes

The new pages are designed to make the app easier to explain in an interview:

- `Risk Rules` shows how risk can be automated from onboarding signals.
- `Document Requests` turns missing or rejected documents into clear merchant
  tasks.
- `Timeline` originally explained auditability without crowding the Merchant
  Profile; Feedback 5 folded that purpose into Activity.
- `API Usage` shows operational thinking beyond issuing keys.
- `Admin Settings` centralizes policy configuration.
- `Reports` summarizes conversion and review health.

Production email, live API traffic ingestion, webhook delivery tracking, and
external malware scanning remain future integrations.
