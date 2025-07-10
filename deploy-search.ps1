# GhostNote Advanced Search Deployment Script (PowerShell)
# This script deploys the advanced search indexing and functions

Write-Host "🚀 Starting GhostNote Advanced Search Deployment..." -ForegroundColor Green

# Check if Supabase CLI is installed
try {
    $null = Get-Command supabase -ErrorAction Stop
    Write-Host "✅ Supabase CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Check if we're connected to a Supabase project
try {
    $status = supabase status 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Not connected"
    }
    Write-Host "✅ Connected to Supabase project" -ForegroundColor Green
} catch {
    Write-Host "❌ Not connected to a Supabase project. Please run 'supabase link' first." -ForegroundColor Red
    exit 1
}

# Apply database migrations
Write-Host "📊 Applying database migrations..." -ForegroundColor Cyan
supabase db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database migrations applied successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to apply database migrations" -ForegroundColor Red
    exit 1
}

# Deploy Edge Functions
Write-Host "⚡ Deploying Edge Functions..." -ForegroundColor Cyan

# Deploy hybrid search function
Write-Host "  - Deploying hybrid-search function..." -ForegroundColor Yellow
supabase functions deploy hybrid-search

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ hybrid-search function deployed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to deploy hybrid-search function" -ForegroundColor Red
    exit 1
}

# Deploy advanced search function (if it exists)
if (Test-Path "supabase\functions\advanced-search") {
    Write-Host "  - Deploying advanced-search function..." -ForegroundColor Yellow
    supabase functions deploy advanced-search
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ advanced-search function deployed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to deploy advanced-search function" -ForegroundColor Red
        exit 1
    }
}

# Deploy search-notes function (if it exists)
if (Test-Path "supabase\functions\search-notes") {
    Write-Host "  - Deploying search-notes function..." -ForegroundColor Yellow
    supabase functions deploy search-notes
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ search-notes function deployed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to deploy search-notes function" -ForegroundColor Red
        exit 1
    }
}

# Deploy generate-embedding function (if it exists)
if (Test-Path "supabase\functions\generate-embedding") {
    Write-Host "  - Deploying generate-embedding function..." -ForegroundColor Yellow
    supabase functions deploy generate-embedding
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ generate-embedding function deployed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to deploy generate-embedding function" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Advanced Search Deployment Complete!" -ForegroundColor Green -BackgroundColor DarkGreen
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Test the search functionality in your app" -ForegroundColor White
Write-Host "2. Monitor search performance in the Supabase dashboard" -ForegroundColor White
Write-Host "3. Set up scheduled tasks for maintenance functions:" -ForegroundColor White
Write-Host "   - update_popularity_metrics() - Run daily" -ForegroundColor Gray
Write-Host "   - reindex_search_vectors() - Run weekly" -ForegroundColor Gray
Write-Host "   - maintain_search_indexes() - Run monthly" -ForegroundColor Gray
Write-Host ""
Write-Host "📈 Performance monitoring queries:" -ForegroundColor Cyan
Write-Host "   SELECT * FROM search_performance ORDER BY created_at DESC LIMIT 10;" -ForegroundColor Gray
Write-Host "   SELECT query, COUNT(*) as frequency FROM search_performance GROUP BY query ORDER BY frequency DESC LIMIT 5;" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy searching! 🔍" -ForegroundColor Yellow
