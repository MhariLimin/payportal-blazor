# Security Model

## Authentication and Authorization

- ASP.NET Core Identity owns password hashing, reset tokens, lockout, and cookies.
- `Merchant` and `Admin` roles gate routes.
- Services enforce ownership and role rules; UI visibility is not treated as
  authorization.

## KYC Files

- Files are limited to PDF, PNG, and JPEG and to 10 MB.
- Server-generated names prevent trusting browser filenames.
- Files are stored under `uploads/kyc`, outside `wwwroot`.
- Storage paths are canonicalized to prevent traversal.
- Authorized download endpoints re-check merchant ownership or the Admin role
  before streaming file content.

## Company Logos

- Logos are limited to PNG and JPEG and to 2 MB.
- Logo files use generated names under private local storage.
- Merchant ownership is required to replace a logo; authenticated owners and
  administrators can view it.

## API Credentials

- Public keys and secrets use `RandomNumberGenerator`.
- Secrets are hashed with an ASP.NET password hasher.
- Plaintext secrets are returned only by issue and rotation operations.
- Rotation revokes the existing credential before issuing a replacement.

## Sensitive Data

- Do not log passwords, reset tokens, KYC bytes, API secrets, or banking values.
- Put connection strings and seed credentials in environment variables or
  user secrets.
- Add malware scanning and object storage before accepting production uploads.
- Replace the development reset-link display with an email provider.

## Production Checklist

- Generate and review EF migrations.
- Enforce confirmed email and MFA for administrators.
- Store KYC files in encrypted private object storage.
- Add rate limiting and security headers.
- Configure data retention and audit export.
- Add integration tests for cross-merchant denial.
