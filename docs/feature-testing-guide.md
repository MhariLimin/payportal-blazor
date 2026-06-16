# Feature and UI Testing Guide

This guide covers every user-facing feature currently implemented in PayPortal.
Run the application with:

```powershell
.\scripts\run-local.ps1
```

The first launcher run displays a generated local administrator credential once
and stores it in ASP.NET Core User Secrets. Use `-ResetAdminSecrets` when a new
local password is required.

## Test Data Strategy

Use at least three merchant accounts:

1. Merchant A for approval and API credential testing.
2. Merchant B for rejection testing.
3. Merchant C for requesting additional documents.

Use unique emails because Identity requires unique accounts.

## 1. Anonymous Access and Authorization

1. Open `http://localhost:5088/` in a private browser window.
2. Confirm the app redirects to `/account/login`.
3. Directly open `/applications` and `/admin/reviews`.
4. Confirm both routes redirect to login while signed out.

Expected: protected pages are unavailable without authentication.

## 2. Merchant Registration

1. Open `/account/register`.
2. Submit the empty form.
3. Confirm required-field validation appears.
4. Confirm required fields have red indicators.
5. Choose business type and industry from the standard dropdown lists.
6. Enter company, tax, contact, address, and password details.
7. Submit the form.

Expected:

- The account is created and automatically signed in.
- The browser redirects to the dashboard.
- The user has the Merchant role.
- A merchant application, primary contact, registered address, and onboarding
  milestones exist.

Negative checks:

- Try an already registered email.
- Try mismatched passwords.
- Try a password without the required length, uppercase character, or digit.

## 3. Login, Logout, and Remember Me

1. Log out using the top-right `Log out` button.
2. Sign in with the merchant email and password.
3. Confirm invalid credentials show an error.
4. Sign in successfully with `Remember me` unchecked.
5. Log out, sign in with `Remember me` checked, then reopen the browser.

Expected: valid users reach the dashboard, invalid credentials are rejected,
and logout returns to the login page.

## 4. Password Reset

1. On the login page, select `Forgot password?`.
2. Enter a registered email and select `Create reset link`.
3. Select `Open development reset link`.
4. Enter and confirm a new valid password.
5. Sign in with the new password.

Expected: the reset token changes the password and the old password no longer
works.

Current development behavior: the reset link is displayed in the UI instead of
being sent through email.

## 5. Merchant Dashboard

1. Sign in as a Merchant.
2. Open `/`.
3. Review onboarding progress, uploaded documents, verified documents, and API
   credential count.
4. Review Next Steps, recent documents, account readiness, and operational
   access.

Expected: a Merchant sees a dashboard focused on its own application rather
than the administrator's portfolio metrics.

## 6. Merchant Profile

1. Open the top-right profile dropdown and select `Profile`.
2. Confirm company name, business type, tax ID, contact, and registered address
   match registration values.
3. Confirm application date, status, risk level, and onboarding progress are
   displayed.
4. Select `Edit profile`, update company/contact/address fields, and save.
5. Upload a PNG or JPEG company logo smaller than 2 MB.
6. Confirm the logo appears on the profile and in the account menu.
7. Select `View KYC documents`.

Expected: a Merchant can update only its own profile and logo. Admin can inspect
the profile but cannot edit merchant-owned details.

## 7. KYC Document Upload

1. Open `KYC Verification`.
2. Select `Upload Document`.
3. Choose a document type.
4. Upload the three required documents in any order.
5. Confirm document progress completes and the application moves to Under
   Review after all required evidence is present.
6. Confirm Compliance Review remains pending until an administrator acts.
7. Select `View or download` and confirm the authorized file opens/downloads.
8. Confirm recent activity identifies the merchant and document type.

Negative checks:

- Attempt a file larger than 10 MB.
- Attempt an unsupported file type.
- Open and cancel the upload dialog.

Expected: only allowed file types and sizes are persisted. Uploaded files are
stored outside the public web root with generated storage names.

## 8. Administrator Dashboard and Navigation

1. Log out and sign in as the seeded administrator.
2. Confirm the sidebar shows grouped `Onboarding` options for Applications and
   Document Requests.
3. Confirm the sidebar shows grouped `Monitoring` options for Risk Rules, API
   Usage, and Reports.
4. Confirm `Admin Settings` is in the top-right user dropdown, not the sidebar.
5. Confirm it does not show Merchant Profile, KYC Verification, or API
   Credentials.
6. Open the dashboard and review aggregate statistics, funnel bars, decision
   mix chart, risk attention, pending approvals, and recent activity.
7. Confirm activity descriptions identify which merchant performed the action.

Expected: Admin sees portal-wide data and Admin-only navigation.

## 9. Merchant Directory Search and Filters

1. Open `Merchant Directory`.
2. Search by a full or partial company name.
3. Search by industry when populated.
4. Filter by status.
5. Filter by risk level.
6. Filter by business type and industry.
7. Combine multiple filters.
8. Select `View profile`.
9. Confirm there is no `Review` button in Merchant Directory.
10. Open `Applications` to perform all review actions.

Expected: the list updates immediately and links open the selected merchant's
profile or preselected compliance decision dialog.

## 10. Admin Merchant and KYC Inspection

1. From Merchant Directory, open a merchant profile.
2. Confirm Admin can inspect company, contact, address, application status,
   risk, and onboarding progress.
3. Open that merchant's KYC page.
4. Confirm breadcrumbs and a back button preserve admin navigation context.
5. Confirm uploaded document metadata and status are visible.
6. Open or download each uploaded document from the KYC page or review modal.

Expected: Admin can inspect any merchant while Merchant users remain
owner-scoped.

## 11. Request Additional Documents

1. Open `Applications`.
2. Select Merchant C.
3. Select `Request Documents`.
4. Enter specific reviewer notes.
5. Submit the decision.
6. Sign in as Merchant C and open KYC Verification.

Expected:

- Reviewer notes appear in the approval timeline.
- The merchant remains pending.
- The decision is recorded in review history and activity.

Negative check: submit without reviewer notes and confirm validation blocks it.

## 12. Reject an Application

1. Open `Applications`.
2. Select Merchant B.
3. Select `Reject`.
4. Enter a rejection explanation and submit.
5. Check the Admin dashboard and Applications list.
6. Sign in as Merchant B.

Expected:

- Status becomes `Rejected`.
- The review and notes appear in history.
- Rejected totals update.
- API credential creation remains unavailable.

## 13. Approve an Application

1. Open `Applications`.
2. Select Merchant A.
3. Select `Approve`.
4. Enter approval notes and submit.
5. Confirm the application status becomes `Approved`.
6. Sign in as Merchant A.

Expected:

- Approved totals and approval rate update.
- Approval notes appear on the merchant KYC timeline.
- The Merchant Profile shows Approved status.
- API credential creation becomes available.

## 14. API Credential Creation

1. Sign in as approved Merchant A.
2. Open `API Credentials`.
3. Select `Create Key`.
4. Enter a name, choose Sandbox or Production, and select permissions.
5. Create the key.
6. Save the displayed public key and secret for comparison.
7. Select `I have saved it`.

Expected:

- The credential appears in the list as Active.
- The secret is displayed only in the creation result.
- The stored credential list shows only a masked public key.
- An issuance activity is recorded.

Negative check: sign in as an unapproved merchant and confirm `Create Key` is
disabled.

## 15. API Credential Rotation

1. On an active credential, select `Regenerate`.
2. Save the newly displayed key and secret.
3. Dismiss the one-time secret panel.

Expected:

- The previous credential becomes Revoked.
- A new active credential is created.
- The new secret differs from the old secret.
- Rotation is recorded in activity.

## 16. Role Isolation

Merchant checks:

1. Sign in as a Merchant.
2. Directly open `/applications` and `/admin/reviews`.
3. Attempt to open another merchant's `/merchants/{id}` URL if an ID is known.

Admin checks:

1. Sign in as Admin.
2. Confirm Applications, Merchant Directory, and Activity are available.
3. Confirm Admin can inspect multiple merchant records.

Expected: route authorization and service-level ownership checks prevent
cross-role and cross-merchant access.

## 17. Branding and Theme

1. Confirm PayPortal artwork appears on account and authenticated screens.
2. Open the user menu from the top-right avatar or company logo.
3. Confirm Light, Dark, and System are grouped under `Themes`.
4. Switch between Light, Dark, and System themes.
5. Reload the browser and confirm the selected theme persists.
6. Confirm logout is available inside the same dropdown.

## 18. Admin Document Review and Compliance Review

1. Sign in as Admin and open `Applications`.
2. Select a merchant with uploaded KYC evidence.
3. Use `Verify` on one document.
4. Enter reviewer notes and use `Reject` on another document.
5. Enter reviewer notes and select `Complete Compliance Review`.
6. Open the merchant KYC page and confirm milestones and document statuses.

Expected: document statuses update independently from final approval, and
Compliance Review can be completed before the final approve/reject decision.

## 19. Activity and Notifications

Admin checks:

1. Open `Activity`.
2. Filter by merchant, actor text, action type, and date range.
3. Confirm dashboard funnel/chart links open `Merchant Directory` with matching
   query filters.

Merchant checks:

1. Sign in as a Merchant.
2. Select the notification icon beside the top-right user logo.
3. Confirm the icon is bell-shaped.
4. Confirm the modal opens lower in the viewport and shows only action-required
   items, not recent activity.
5. Click outside the modal and confirm it closes.
6. Open `Activity` and confirm only that merchant's own activity plus admin
   interactions for that merchant are listed.
7. Confirm the Merchant Profile no longer repeats the audit log.

## 20. Document Requests and Operational Pages

1. Open `Risk Rules` as Admin and confirm the rule cards and high-risk queue
   are visible.
2. Open `Document Requests` as Admin and confirm merchants appear as grouped
   sections with dropdowns for missing or rejected documents.
3. Sign in as Merchant and open `KYC Verification`.
4. Confirm missing document requests appear under `Document Requirements`.
5. Reject a document as Admin, then confirm the merchant KYC page marks the
   rejected upload and shows a `Resubmit` action in the same requirement row.
6. Open `API Usage` and confirm credential telemetry, request estimates, error
   rate, and webhook status are visible.
7. Open `Admin Settings` from the user dropdown and confirm file controls,
   document requirements, password guidance, and SLA targets are visible.
8. Open `Reports` and confirm conversion, approval rate, rejection reason, and
   document completeness summaries are visible.
9. On `Applications`, select multiple rows and use `Export selected`.
10. On `Applications`, save an internal admin note and confirm it appears only
   in the admin review modal, not the merchant KYC timeline.

## Remaining Development-Only Behavior

- Password reset links are displayed instead of delivered by email.
- Webhook management uses demo telemetry only.
- KYC files use private local disk storage. The UI now shows production scan
  readiness, but no external malware scanning vendor is connected.
