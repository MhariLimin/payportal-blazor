# 19. Feedback 4 Review Workflow Improvements

## Outcome

- Added internal admin notes through `IReviewService.AddAdminNoteAsync`.
- Hid internal admin notes from merchant-facing KYC review timelines.
- Added document scan readiness indicators in the Applications review modal.
- Added multi-select export preparation on Applications.
- Added risk scoring updates based on industry, business type, and rejected
  document count.
- Extended activity descriptions for internal admin notes.

## Files

- `src/PayPortal.Application/Abstractions/Services.cs`
- `src/PayPortal.Infrastructure/Services/WorkflowServices.cs`
- `src/PayPortal.Infrastructure/Services/MerchantService.cs`
- `src/PayPortal.Infrastructure/Services/ActivityService.cs`
- `src/PayPortal.Web/Components/Pages/AdminReviews.razor`
- `src/PayPortal.Web/Components/Pages/Kyc.razor`
