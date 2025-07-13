#!/bin/bash

# Feature Development Script for Homepage
# This script helps you work on the homepage feature in isolation

echo "🚀 Setting up Homepage Feature Development Environment"

# Check if we're in the right directory
if [ ! -f "tsconfig.json" ]; then
    echo "❌ Please run this from the homepage feature directory"
    exit 1
fi

echo "✅ Homepage feature directory detected"

# Check if the root dev server is running
ROOT_DIR="../../../"
if [ ! -f "$ROOT_DIR/package.json" ]; then
    echo "❌ Cannot find root package.json"
    exit 1
fi

echo "📦 Root project found"

# Instructions for development
echo ""
echo "🔧 Development Setup Complete!"
echo ""
echo "To start developing:"
echo "1. Open this folder in VSCode: code homepage.code-workspace"
echo "2. In a terminal at project root, run: npm run dev"
echo "3. Work on files in this feature folder"
echo "4. See hot-reloads at http://localhost:3000/homepage"
echo ""
echo "📁 Feature Structure:"
echo "├── components/     # Local components (use relative imports: ./components/...)"
echo "├── hooks/          # Local hooks (use relative imports: ./hooks/...)"
echo "├── utils/          # Local utilities (use relative imports: ./utils/...)"
echo "├── types/          # Local types (use relative imports: ./types/...)"
echo "└── page.tsx        # Main page component"
echo ""
echo "📝 Import Guidelines:"
echo "• Local imports: import Component from './components/Component'"
echo "• Global imports: import Component from '@/components/ui/button'"
echo "• Lib imports: import { supabase } from '@/lib/supabase'"
echo ""
