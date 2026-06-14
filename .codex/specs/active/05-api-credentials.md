# 05 API Credentials

## Goal

Allow approved merchants to issue and rotate credentials securely.

## Acceptance

- Key and secret are generated with cryptographic randomness.
- Secret hashes, not plaintext secrets, are persisted.
- The secret is displayed only in the create/rotate result.
- Rotation revokes the old credential and creates an activity record.

