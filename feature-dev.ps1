# GhostNote Feature Development Helper (PowerShell)
# This script helps set up the development environment for feature-based workflow

param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$FeatureName
)

function Write-Header {
    Write-Host "🚀 GhostNote Feature Development Helper" -ForegroundColor Cyan
    Write-Host "=======================================" -ForegroundColor Cyan
}

function Open-Feature {
    param([string]$Feature)
    
    $appPath = "src\app\$Feature"
    $featuresPath = "src\features\$Feature"
    
    if (Test-Path $appPath) {
        Write-Host "📂 Opening $Feature feature in VSCode..." -ForegroundColor Green
        code $appPath
    }
    elseif (Test-Path $featuresPath) {
        Write-Host "📂 Opening $Feature feature in VSCode (legacy structure)..." -ForegroundColor Green
        code $featuresPath
    }
    else {
        Write-Host "❌ Feature '$Feature' not found" -ForegroundColor Red
        Write-Host "Available features:" -ForegroundColor Yellow
        Get-ChildItem "src\app" -Directory | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
        Get-ChildItem "src\features" -Directory | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
    }
}

function New-Feature {
    param([string]$Feature)
    
    $featurePath = "src\app\$Feature"
    
    if (Test-Path $featurePath) {
        Write-Host "❌ Feature '$Feature' already exists" -ForegroundColor Red
        return
    }
    
    Write-Host "🆕 Creating new feature: $Feature" -ForegroundColor Green
    
    # Create directories
    New-Item -ItemType Directory -Path "$featurePath\components" -Force | Out-Null
    New-Item -ItemType Directory -Path "$featurePath\hooks" -Force | Out-Null
    New-Item -ItemType Directory -Path "$featurePath\utils" -Force | Out-Null
    
    # Copy README template
    if (Test-Path "FEATURE_README_TEMPLATE.md") {
        Copy-Item "FEATURE_README_TEMPLATE.md" "$featurePath\README.md"
        (Get-Content "$featurePath\README.md") -replace '\[feature-name\]', $Feature | Set-Content "$featurePath\README.md"
    }
    
    # Create basic page.tsx
    $pageContent = @"
"use client";

export default function $($Feature.Substring(0,1).ToUpper() + $Feature.Substring(1))Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">$Feature Feature</h1>
      <p className="text-gray-300">
        This is the $Feature feature page. Start building your components in the components/ folder.
      </p>
    </div>
  );
}
"@
    
    Set-Content "$featurePath\page.tsx" $pageContent
    
    Write-Host "✅ Feature '$Feature' created successfully!" -ForegroundColor Green
    Write-Host "📂 Opening in VSCode..." -ForegroundColor Cyan
    code $featurePath
}

function Start-Dev {
    Write-Host "🔥 Starting development server..." -ForegroundColor Green
    Write-Host "Keep this running while you work on features!" -ForegroundColor Yellow
    npm run dev
}

function Show-Features {
    Write-Host "📋 Available Features:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "App Router Features (new structure):" -ForegroundColor Yellow
    Get-ChildItem "src\app" -Directory | ForEach-Object { 
        Write-Host "  - $($_.Name)" -ForegroundColor Gray 
    }
    Write-Host ""
    Write-Host "Legacy Features:" -ForegroundColor Yellow
    Get-ChildItem "src\features" -Directory | ForEach-Object { 
        Write-Host "  - $($_.Name)" -ForegroundColor Gray 
    }
}

function Open-Workspace {
    Write-Host "🏢 Opening VSCode workspace..." -ForegroundColor Green
    code "ghostnote.code-workspace"
}

function Show-Help {
    Write-Host "GhostNote Feature Development Commands:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  .\feature-dev.ps1 dev                    Start development server" -ForegroundColor White
    Write-Host "  .\feature-dev.ps1 open <feature>         Open feature in VSCode" -ForegroundColor White
    Write-Host "  .\feature-dev.ps1 create <feature>       Create new feature" -ForegroundColor White
    Write-Host "  .\feature-dev.ps1 list                   List available features" -ForegroundColor White
    Write-Host "  .\feature-dev.ps1 workspace              Open VSCode workspace" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Green
    Write-Host "  .\feature-dev.ps1 dev                    # Start dev server" -ForegroundColor Gray
    Write-Host "  .\feature-dev.ps1 open homepage          # Open homepage feature" -ForegroundColor Gray
    Write-Host "  .\feature-dev.ps1 create my-feature      # Create new feature" -ForegroundColor Gray
    Write-Host "  .\feature-dev.ps1 workspace              # Open full workspace" -ForegroundColor Gray
}

# Main execution
Write-Header

switch ($Command) {
    "open" {
        if ([string]::IsNullOrEmpty($FeatureName)) {
            Write-Host "Usage: .\feature-dev.ps1 open <feature-name>" -ForegroundColor Red
            Write-Host "Example: .\feature-dev.ps1 open homepage" -ForegroundColor Yellow
            exit 1
        }
        Open-Feature $FeatureName
    }
    "create" {
        if ([string]::IsNullOrEmpty($FeatureName)) {
            Write-Host "Usage: .\feature-dev.ps1 create <feature-name>" -ForegroundColor Red
            Write-Host "Example: .\feature-dev.ps1 create dashboard" -ForegroundColor Yellow
            exit 1
        }
        New-Feature $FeatureName
    }
    "dev" {
        Start-Dev
    }
    "list" {
        Show-Features
    }
    "workspace" {
        Open-Workspace
    }
    default {
        Show-Help
    }
}
