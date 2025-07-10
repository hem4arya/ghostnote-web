#!/bin/bash

# GhostNote Advanced Search Deployment Script
# This script deploys the advanced search indexing and functions

echo "🚀 Starting GhostNote Advanced Search Deployment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're logged in to Supabase
if ! supabase status &> /dev/null; then
    echo "❌ Not connected to a Supabase project. Please run 'supabase link' first."
    exit 1
fi

echo "✅ Supabase CLI found and project connected"

# Apply database migrations
echo "📊 Applying database migrations..."
supabase db push

if [ $? -eq 0 ]; then
    echo "✅ Database migrations applied successfully"
else
    echo "❌ Failed to apply database migrations"
    exit 1
fi

# Deploy Edge Functions
echo "⚡ Deploying Edge Functions..."

# Deploy hybrid search function
echo "  - Deploying hybrid-search function..."
supabase functions deploy hybrid-search

if [ $? -eq 0 ]; then
    echo "✅ hybrid-search function deployed successfully"
else
    echo "❌ Failed to deploy hybrid-search function"
    exit 1
fi

# Deploy advanced search function (if it exists)
if [ -d "supabase/functions/advanced-search" ]; then
    echo "  - Deploying advanced-search function..."
    supabase functions deploy advanced-search
    
    if [ $? -eq 0 ]; then
        echo "✅ advanced-search function deployed successfully"
    else
        echo "❌ Failed to deploy advanced-search function"
        exit 1
    fi
fi

# Deploy search-notes function (if it exists)
if [ -d "supabase/functions/search-notes" ]; then
    echo "  - Deploying search-notes function..."
    supabase functions deploy search-notes
    
    if [ $? -eq 0 ]; then
        echo "✅ search-notes function deployed successfully"
    else
        echo "❌ Failed to deploy search-notes function"
        exit 1
    fi
fi

# Deploy generate-embedding function (if it exists)
if [ -d "supabase/functions/generate-embedding" ]; then
    echo "  - Deploying generate-embedding function..."
    supabase functions deploy generate-embedding
    
    if [ $? -eq 0 ]; then
        echo "✅ generate-embedding function deployed successfully"
    else
        echo "❌ Failed to deploy generate-embedding function"
        exit 1
    fi
fi

echo ""
echo "🎉 Advanced Search Deployment Complete!"
echo ""
echo "Next steps:"
echo "1. Test the search functionality in your app"
echo "2. Monitor search performance in the Supabase dashboard"
echo "3. Set up scheduled tasks for maintenance functions:"
echo "   - update_popularity_metrics() - Run daily"
echo "   - reindex_search_vectors() - Run weekly"
echo "   - maintain_search_indexes() - Run monthly"
echo ""
echo "📈 Performance monitoring queries:"
echo "   SELECT * FROM search_performance ORDER BY created_at DESC LIMIT 10;"
echo "   SELECT query, COUNT(*) as frequency FROM search_performance GROUP BY query ORDER BY frequency DESC LIMIT 5;"
echo ""
echo "Happy searching! 🔍"
