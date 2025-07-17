# PowerShell build script for Windows users

Write-Host "🚀 Building Navbar package..." -ForegroundColor Cyan

# Ensure we have the latest dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
pnpm install

# Run TypeScript build
Write-Host "🔧 Building TypeScript..." -ForegroundColor Yellow
pnpm build

# Run type checking
Write-Host "🔍 Running type checking..." -ForegroundColor Yellow
pnpm type-check

# Run linting
Write-Host "🧹 Running linter..." -ForegroundColor Yellow
pnpm lint

Write-Host "✅ Navbar package built successfully!" -ForegroundColor Green
