# Feature and UI Testing Guide

This guide covers every user-facing feature currently implemented in PayPortal.
Run the application with:

```powershell
.\scripts\run-local.ps1
```

Default administrator credentials are defined in `.env.local`. The template
uses:

```text
Email: admin@payportal.local
Password: ChangeThis123!
```

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
4. Enter company name, business type, tax ID, contact details, address, and a
   password that satisfies the Identity policy.
5. Submit the form.

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
3. Review total merchant, pending, under-review, and approved statistics.
4. Review approval rate, funnel, pending approvals, and recent activity.

Expected: a Merchant sees data scoped to its own application. New actions such
as document uploads and credential issuance appear in recent activity.

## 6. Merchant Profile

1. Select `Merchant Profile` in the sidebar.
2. Confirm company name, business type, tax ID, contact, and registered address
   match registration values.
3. Confirm application date, status, risk level, and onboarding progress are
   displayed.
4. Select `Review KYC documents`.

Expected: a Merchant can view only its own profile. The quick action opens the
merchant's KYC page.

Current scope: profile editing is not implemented; the page is read-only.

## 7. KYC Document Upload

1. Open `KYC Verification`.
2. Select `Upload Document`.
3. Choose a document type.
4. Upload a PDF, PNG, or JPEG smaller than 10 MB.
5. Confirm the document appears with `Pending` status.
6. Confirm the total and pending counters update.
7. Confirm a recent `document uploaded` activity appears on the dashboard.

Negative checks:

- Attempt a file larger than 10 MB.
- Attempt an unsupported file type.
- Open and cancel the upload dialog.

Expected: only allowed file types and sizes are persisted. Uploaded files are
stored outside the public web root with generated storage names.

## 8. Administrator Dashboard and Navigation

1. Log out and sign in as the seeded administrator.
2. Confirm the sidebar shows `Applications` and `Admin Review`.
3. Confirm it does not show Merchant-only `API Credentials`.
4. Open the dashboard and review aggregate statistics and recent activity.

Expected: Admin sees portal-wide data and Admin-only navigation.

## 9. Application Search and Filters

1. Open `Applications`.
2. Search by a full or partial company name.
3. Search by industry when populated.
4. Filter by status.
5. Filter by risk level.
6. Combine search, status, and risk filters.
7. Select `View profile`.
8. Return and select `Review`.

Expected: the list updates immediately and links open the selected merchant's
profile or preselected review dialog.

## 10. Admin Merchant and KYC Inspection

1. From Applications, open a merchant profile.
2. Confirm Admin can inspect company, contact, address, application status,
   risk, and onboarding progress.
3. Open that merchant's KYC page.
4. Confirm uploaded document metadata and status are visible.

Expected: Admin can inspect any merchant while Merchant users remain
owner-scoped.

## 11. Request Additional Documents

1. Open `Admin Review`.
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

1. Open `Admin Review`.
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

1. Open `Admin Review`.
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
2. Confirm Applications and Admin Review are available.
3. Confirm Admin can inspect multiple merchant records.

Expected: route authorization and service-level ownership checks prevent
cross-role and cross-merchant access.

## Display-Only Elements

The following visible elements are currently presentation-only:

- The top-bar search placeholder.
- Profile editing.
- Email delivery for password reset.
- Direct document viewing/downloading.
- Webhook management.

Do not report these as functional workflows until their services and UI actions
are implemented.
