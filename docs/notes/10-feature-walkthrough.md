# 10. Follow One Feature End to End

Understanding one complete feature is often easier than studying every file.

This example follows KYC document upload.

## Step 1: The User Opens the Page

Route:

```text
/kyc
```

Component:

```text
src/PayPortal.Web/Components/Pages/Kyc.razor
```

The page injects:

```razor
@inject IMerchantService MerchantService
@inject IKycService KycService
```

These are Application-layer contracts.

## Step 2: The Page Loads the Merchant

The component asks `IMerchantService` for the merchant the current user may
access.

The service checks:

- Is the current user an Admin?
- If not, which merchant does this user own?
- Is the requested merchant allowed?

This prevents cross-merchant access.

## Step 3: The User Chooses a File

Blazor's `InputFile` component receives the browser file selection.

The page does not immediately save the file. It first stores the selected file
reference in component state.

## Step 4: The User Clicks Upload

The page runs:

```csharp
KycService.UploadAsync(...)
```

The page passes:

- Merchant ID.
- Document type.
- Original file name.
- Content type.
- Size.
- File stream.

## Step 5: The Service Validates the Upload

`KycService` is implemented in Infrastructure.

It checks:

- File size is greater than zero.
- File is no larger than 10 MB.
- Content type is PDF, PNG, or JPEG.
- The current user may access the merchant.

The service is responsible for these rules because browser validation alone can
be bypassed.

## Step 6: Private File Storage Saves the File

`IFileStorage` is the contract.

`PrivateFileStorage` is the implementation.

It:

1. Generates a random storage filename.
2. Saves under `uploads/kyc`.
3. Keeps the file outside `wwwroot`.
4. Prevents unsafe path traversal.

The original browser filename is not trusted as the physical storage path.

## Step 7: EF Core Saves Metadata

The service creates a `KycDocument` entity.

EF Core saves metadata to MySQL:

- Merchant ID.
- Document type.
- Original name.
- Generated storage name.
- File size.
- Content type.
- Pending status.

## Step 8: Activity Is Recorded

The service also creates an `ActivityEntry` such as:

```text
document_uploaded
```

This creates an audit history.

## Step 9: The Page Reloads Data

After upload, the component asks the merchant service for fresh data and Blazor
rerenders:

- Total document count.
- Pending count.
- Uploaded document list.
- Dashboard activity.

## Complete Flow

```text
Browser file selection
        |
        v
Kyc.razor
        |
        v
IKycService contract
        |
        v
KycService implementation
        |
        +-- ownership and file validation
        +-- IFileStorage -> private disk file
        +-- PortalDbContext -> MySQL metadata
        +-- ActivityEntry -> audit record
        |
        v
Blazor reloads and updates the screen
```

## What This Demonstrates

This one feature uses almost the whole stack:

- Blazor UI.
- C# event handling.
- Dependency injection.
- Application interfaces.
- Infrastructure services.
- Authorization.
- File storage.
- EF Core.
- MySQL.
- Audit logging.

## Simple Interview Explanation

> For KYC upload, the Blazor page sends the selected file to an application
> service contract. Infrastructure validates ownership, type, and size, saves
> the file outside the public web root, stores metadata through EF Core, and
> writes an activity record. The component then reloads the merchant and Blazor
> updates the UI.
