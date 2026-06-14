# 5. Blazor and the UI

## What Is Blazor?

Blazor is a .NET UI framework. It allows pages to be built using:

- HTML markup.
- Razor syntax.
- C# code.

Blazor files usually end in `.razor`.

Example:

```razor
@page "/applications"
@attribute [Authorize(Roles = PortalRoles.Admin)]

<h1>Merchant Applications</h1>
```

## Razor Syntax

The `@` symbol switches from HTML to C#.

```razor
<p>@merchant.CompanyName</p>
```

This prints a C# property into HTML.

```razor
@if (merchant.Status == MerchantStatus.Approved)
{
    <p>Approved</p>
}
```

This uses normal C# logic to choose what HTML to render.

## A Component Is a Reusable UI Unit

A `.razor` file is a component.

Components can be:

- Full pages.
- Layouts.
- Navigation menus.
- Small reusable controls such as `StatusBadge`.

## Routes

`@page` gives a component a URL:

```razor
@page "/kyc"
```

The KYC component is available at:

```text
http://localhost:5088/kyc
```

Routes can contain values:

```razor
@page "/merchants/{MerchantId:guid}"
```

The merchant ID from the URL becomes a component parameter.

## Injecting Services

Blazor components receive services through dependency injection:

```razor
@inject IMerchantService MerchantService
```

The page does not create `MerchantService`. ASP.NET Core provides the registered
implementation.

## Component Lifecycle

A page often loads data when it starts:

```csharp
protected override async Task OnInitializedAsync()
{
    model = await MerchantService.GetDashboardAsync();
}
```

This means:

1. The component is being initialized.
2. It asks the service for data.
3. It waits asynchronously.
4. Blazor rerenders with the result.

## Handling User Actions

```razor
<button @onclick="UploadAsync">Upload</button>
```

When clicked, Blazor runs the C# `UploadAsync` method on the server.

## What Interactive Server Means

PayPortal uses:

```razor
@rendermode InteractiveServer
```

The component's C# code runs on the server, not in the browser.

The browser and server maintain a SignalR connection:

```text
Browser click
   |
   v
SignalR message
   |
   v
C# event handler runs on server
   |
   v
Blazor calculates UI changes
   |
   v
Small update sent to browser
```

Advantages:

- UI logic stays in C#.
- Database credentials never go to the browser.
- The browser downloads less application code.

Tradeoffs:

- A live server connection is required.
- Connection quality affects interactivity.
- Server resources are used for each active session.

## Static Account Pages

Login and registration forms use normal server form posts because authentication
cookies must be written into an HTTP response.

That is why account flows are slightly different from interactive dashboard
pages.

## Layout and Navigation

`MainLayout.razor` provides the common header, sidebar, and main content area.

`NavMenu.razor` changes links based on role using `AuthorizeView`.

Remember: hiding a link is only presentation. Services and route attributes
still perform the real security checks.

## Simple Interview Explanation

> Blazor lets the UI use Razor markup and C# together. PayPortal uses Interactive
> Server rendering, so UI events run as C# on the server and updates are sent to
> the browser through SignalR. Account pages use server form posts where Identity
> needs to issue authentication cookies.
