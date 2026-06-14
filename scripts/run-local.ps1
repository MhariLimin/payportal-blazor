[CmdletBinding()]
param(
    [switch]$SkipDocker,
    [switch]$SkipRestore,
    [switch]$BuildOnly,
    [ValidateSet("Debug", "Release")]
    [string]$Configuration = "Debug"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

function Import-DotEnv {
    param([Parameter(Mandatory)][string]$Path)

    foreach ($line in Get-Content -LiteralPath $Path) {
        $trimmed = $line.Trim()
        if (-not $trimmed -or $trimmed.StartsWith("#")) {
            continue
        }

        $separator = $trimmed.IndexOf("=")
        if ($separator -lt 1) {
            throw "Invalid .env.local entry: $line"
        }

        $name = $trimmed.Substring(0, $separator).Trim()
        $value = $trimmed.Substring($separator + 1).Trim()
        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or
            ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        [Environment]::SetEnvironmentVariable($name, $value, "Process")
    }
}

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

$envFile = Join-Path $root ".env.local"
if (-not (Test-Path -LiteralPath $envFile)) {
    Copy-Item -LiteralPath (Join-Path $root ".env.example") -Destination $envFile
    Write-Host "Created .env.local from .env.example. Review its local credentials as needed." -ForegroundColor Yellow
}
Import-DotEnv -Path $envFile

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

dotnet build PayPortal.sln --no-restore --configuration $Configuration

if ($BuildOnly) {
    Write-Host "PayPortal build completed." -ForegroundColor Green
    exit 0
}

Write-Host "Starting PayPortal at $env:ASPNETCORE_URLS" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the web application." -ForegroundColor DarkGray
dotnet run --project src/PayPortal.Web --no-build --configuration $Configuration
