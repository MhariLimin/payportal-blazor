# PayPortal Feature Suggestions

Review these options before writing Post Implementation Feedback 3.

## High-Value Demo Improvements

1. **Admin activity filters:** filter activity by merchant, actor, action type,
   and date range.
2. **Document status actions:** let admins verify or reject individual KYC
   documents instead of only approving the whole application.
3. **Merchant notification center:** show requests, approvals, rejections, and
   next actions in a dedicated notification panel.
4. **Dashboard drill-downs:** make dashboard charts clickable so admins can jump
   to matching filtered applications.
5. **Application audit log:** expose a chronological audit history for every
   merchant profile, document, review, and credential event.

## More Realistic Business Workflow

1. **Reviewer assignment:** assign applications to a specific admin reviewer.
2. **Risk scoring:** calculate risk from industry, country, document status, and
   review history instead of manually showing a static risk level.
3. **Additional document requests:** let admins request a specific missing file
   category and let merchants respond to that request.
4. **Profile completeness score:** show missing profile fields and guide the
   merchant through completion.
5. **Application status timeline:** combine profile edits, uploads, review
   decisions, and credential actions into one merchant-facing timeline.

## Technical Depth for Interview Discussion

1. **Authorization tests:** add tests proving merchants cannot access another
   merchant's profile, KYC documents, or credentials.
2. **Integration tests:** verify registration, login, KYC upload, admin review,
   and credential creation with a test database.
3. **Background email service:** send password reset, approval, rejection, and
   document-request emails through a queued service.
4. **Object storage abstraction:** move local private files to S3/Azure Blob
   compatible storage behind the existing storage interface.
5. **Observability:** add structured logs, health checks, and basic metrics for
   database, storage, and authentication flows.

## Production Readiness

1. **MFA for admins:** require stronger authentication for administrator users.
2. **Malware scanning:** scan uploaded KYC files before admins can download
   them.
3. **File retention policy:** define when rejected or stale KYC documents are
   archived or deleted.
4. **Credential permissions UI:** let merchants choose granular API scopes and
   see when keys were last used.
5. **Deployment guide:** document production configuration for MySQL, storage,
   secrets, HTTPS, and database migrations.
