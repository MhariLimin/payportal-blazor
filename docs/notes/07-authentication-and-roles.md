# 7. Authentication and Authorization

These two words sound similar but mean different things.

## Authentication

Authentication answers:

> Who are you?

Examples:

- Registering an account.
- Signing in with email and password.
- Receiving a login cookie.
- Signing out.
- Resetting a password.

PayPortal uses ASP.NET Core Identity for this.

## Authorization

Authorization answers:

> What are you allowed to do?

Examples:

- A Merchant may view its own profile.
- An Admin may view all applications.
- Only an Admin may approve or reject an application.
- Only an approved Merchant may create API credentials.

## Identity

ASP.NET Core Identity manages:

- User records.
- Password hashing.
- Roles.
- Login cookies.
- Password reset tokens.
- Lockout behavior.

PayPortal's user class is:

```text
src/PayPortal.Infrastructure/Identity/PortalUser.cs
```

It extends Identity's normal user with:

- `DisplayName`
- Optional `MerchantId`

## Passwords Are Not Stored as Plain Text

Identity hashes passwords.

Very simplified:

```text
User password
   |
   v
one-way password hashing
   |
   v
hash stored in MySQL
```

When signing in, Identity hashes the submitted password appropriately and
verifies it against the stored hash.

## Login Cookies

After successful login, the server sends an authentication cookie to the
browser.

The browser sends that cookie on later requests.

```text
Login succeeds
   |
   v
Server creates protected auth cookie
   |
   v
Browser stores cookie
   |
   v
Future requests include cookie
   |
   v
ASP.NET Core knows the current user
```

The cookie should not contain the user's plain password.

## Roles

PayPortal uses:

- `Merchant`
- `Admin`

They are created during database seeding.

A page can require a role:

```razor
@attribute [Authorize(Roles = PortalRoles.Admin)]
```

This blocks non-admin users from the page.

## Ownership Checks

Roles are not enough.

Two users may both have the Merchant role, but Merchant A must not view Merchant
B's records.

Services therefore check ownership:

```text
Is the user Admin?
  -> allow selected merchant

Otherwise:
  -> load only the merchant owned by the current user
```

This is called object-level or resource-level authorization.

## UI Checks Are Not Security

`AuthorizeView` can hide Admin links from a Merchant.

But a hidden link alone is not security because someone could type the URL
manually.

PayPortal uses multiple layers:

1. Navigation visibility.
2. `[Authorize]` route attributes.
3. Service-level role and ownership checks.

## API Secrets vs User Passwords

They are different:

- Identity hashes user passwords.
- `SecretGenerator` creates API secrets.
- API secret hashes are stored instead of reusable plaintext secrets.
- The plaintext API secret is shown only when created or rotated.

## Simple Interview Explanation

> Identity handles authentication, including password hashing, cookies, reset
> tokens, and roles. Authorization is enforced with route attributes and service
> checks. Merchants are additionally scoped to their own MerchantId, so hiding
> UI links is not the only protection.
