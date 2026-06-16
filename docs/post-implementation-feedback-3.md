# Post-Implementation Feedback 3

This document maps the third feedback pass to implemented behavior.

1. **UI density:** typography, cards, list rows, buttons, inputs, side nav, and
   timeline elements were made materially smaller. Activity titles are now
   smaller than their section headings.
2. **Admin page clarity:** `/applications` is now the review-focused
   Applications workspace. The old searchable list moved to `Merchant
   Directory` at `/merchant-directory`.
3. **Admin dashboard charts:** funnel bars, decision mix, and risk cards link to
   filtered Merchant Directory views.
4. **Merchant activity scope:** merchant dashboards and notifications use only
   the current merchant's activity. Admin Activity can see all events.
5. **KYC padding:** document requirement rows and uploads have more inner
   padding and lighter separators.
6. **Dashboard vs KYC:** Merchant Dashboard now focuses on readiness, next
   steps, evidence summary, and operational access. KYC is an evidence
   workspace with requirement counts and document status review.
7. **Requirement labels:** punctuation markers were replaced with readable
   statuses: Missing, Pending, Verified, or Rejected.
8. **Compliance review:** admins can complete Compliance Review separately from
   final approval. Verification milestones are ordered as profile, documents,
   compliance review, then approval.
9. **Approved feature set:** implemented admin activity filters, document status
   actions, merchant notifications, dashboard drill-downs, and application audit
   logs.
10. **More suggestions:** see `docs/future-functionality-suggestions.md`.
