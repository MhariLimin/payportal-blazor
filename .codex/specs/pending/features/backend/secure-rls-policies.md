# Secure RLS Policies

## Goal

Replace broad authenticated access with least-privilege policies.

## Scope

- Define ownership and organization relationships.
- Restrict merchants to their own records.
- Allow reviewers only the records and actions required for review.
- Reserve administrative actions for administrators.
- Cover child tables, storage objects, reviews, credentials, and activity.

## Verification

- Add positive and negative policy tests for every role and table.
- Confirm anonymous and cross-merchant access is denied.
