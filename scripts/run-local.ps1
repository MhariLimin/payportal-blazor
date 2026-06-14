[CmdletBinding()]
param(
    [switch]$SkipDocker,
    [switch]$SkipRestore,
    [switch]$BuildOnly,
    [switch]$ConfigureAdminSecrets,
    [ValidateSet("Debug", "Release")]
    [string]$Configuration = "Debug"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$webProject = Join-Path $root "src\PayPortal.Web\PayPortal.Web.csproj"
Set-Location $root

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    $dotnetPath = "C:\Program Files\dotnet"
    if (Test-Path (Join-Path $dotnetPath "dotnet.exe")) {
        $env:Path = "$dotnetPath;$env:Path"
    }
}

if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    throw "The .NET 8 SDK is not available. Install it, then open a new PowerShell window."
}

$sdkVersion = [Version]((dotnet --version) -replace "-.*$", "")
if ($sdkVersion.Major -ne 8) {
    throw "PayPortal requires the .NET 8 SDK. Found $sdkVersion."
}

if (-not $SkipDocker) {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        throw "Docker is not available. Install/start Docker Desktop or use -SkipDocker with an existing MySQL 8 server."
    }

    docker info *> $null
    if ($LASTEXITCODE -ne 0) {
        throw "Docker Desktop is not running."
    }

    docker compose up -d mysql
    if ($LASTEXITCODE -ne 0) {
        throw "MySQL could not be started."
    }

    Write-Host "Waiting for MySQL..." -ForegroundColor Cyan
    $containerId = (docker compose ps -q mysql).Trim()
    if (-not $containerId) {
        throw "The MySQL container was not created."
    }

    $healthy = $false
    for ($attempt = 0; $attempt -lt 40; $attempt++) {
        $status = docker inspect --format "{{.State.Health.Status}}" $containerId 2>$null
        if ($status -eq "healthy") {
            $healthy = $true
            break
        }
        Start-Sleep -Seconds 2
    }

    if (-not $healthy) {
        docker compose logs mysql --tail 40
        throw "MySQL did not become healthy."
    }
}

if (-not $SkipRestore) {
    dotnet tool restore
    dotnet restore PayPortal.sln --configfile NuGet.Config
}

if (-not $BuildOnly) {
    $secrets = dotnet user-secrets list --project $webProject
    $hasEmail = $secrets -match "^SeedAdmin:Email\s*="
    $hasPassword = $secrets -match "^SeedAdmin:Password\s*="

    if ($ConfigureAdminSecrets -or -not ($hasEmail -and $hasPassword)) {
        Write-Host "Configure the local seeded administrator." -ForegroundColor Cyan
        $email = Read-Host "Admin email"
        $securePassword = Read-Host "Admin password" -AsSecureString
        $password = [System.Net.NetworkCredential]::new("", $securePassword).Password

        if ([string]::IsNullOrWhiteSpace($email) -or [string]::IsNullOrWhiteSpace($password)) {
            throw "Admin email and password are required."
        }

        dotnet user-secrets set "SeedAdmin:Email" $email --project $webProject
        dotnet user-secrets set "SeedAdmin:Password" $password --project $webProject
        $password = $null
    }
}

dotnet build PayPortal.sln --no-restore --configuration $Configuration

if ($BuildOnly) {
    Write-Host "PayPortal build completed." -ForegroundColor Green
    exit 0
}

Write-Host "Starting PayPortal at http://localhost:5088" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the web application." -ForegroundColor DarkGray
dotnet run --project $webProject --no-build --configuration $Configuration
