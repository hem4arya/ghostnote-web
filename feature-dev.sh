#!/bin/bash

# GhostNote Feature Development Helper
# This script helps set up the development environment for feature-based workflow

echo "🚀 GhostNote Feature Development Helper"
echo "======================================="

# Function to open a specific feature in VSCode
open_feature() {
    local feature=$1
    if [ -d "src/app/$feature" ]; then
        echo "📂 Opening $feature feature in VSCode..."
        code "src/app/$feature"
    elif [ -d "src/features/$feature" ]; then
        echo "📂 Opening $feature feature in VSCode (legacy structure)..."
        code "src/features/$feature"
    else
        echo "❌ Feature '$feature' not found"
        echo "Available features:"
        ls -la src/app/ | grep "^d" | awk '{print "  - " $9}' | grep -v "^\.$\|^\.\.$"
        ls -la src/features/ | grep "^d" | awk '{print "  - " $9}' | grep -v "^\.$\|^\.\.$"
    fi
}

# Function to create a new feature
create_feature() {
    local feature=$1
    local feature_path="src/app/$feature"
    
    if [ -d "$feature_path" ]; then
        echo "❌ Feature '$feature' already exists"
        return 1
    fi
    
    echo "🆕 Creating new feature: $feature"
    mkdir -p "$feature_path"/{components,hooks,utils}
    
    # Copy README template
    cp FEATURE_README_TEMPLATE.md "$feature_path/README.md"
    sed -i "s/\[feature-name\]/$feature/g" "$feature_path/README.md"
    
    # Create basic page.tsx
    cat > "$feature_path/page.tsx" << EOF
"use client";

export default function ${feature^}Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">$feature Feature</h1>
      <p className="text-gray-300">
        This is the $feature feature page. Start building your components in the components/ folder.
      </p>
    </div>
  );
}
EOF
    
    echo "✅ Feature '$feature' created successfully!"
    echo "📂 Opening in VSCode..."
    code "$feature_path"
}

# Function to start development server
start_dev() {
    echo "🔥 Starting development server..."
    echo "Keep this running while you work on features!"
    npm run dev
}

# Function to show available features
list_features() {
    echo "📋 Available Features:"
    echo ""
    echo "App Router Features (new structure):"
    find src/app -maxdepth 1 -type d ! -path src/app ! -name ".*" | sed 's|src/app/|  - |'
    echo ""
    echo "Legacy Features:"
    find src/features -maxdepth 1 -type d ! -path src/features ! -name ".*" | sed 's|src/features/|  - |'
}

# Function to open workspace
open_workspace() {
    echo "🏢 Opening VSCode workspace..."
    code ghostnote.code-workspace
}

# Main menu
case "$1" in
    "open")
        if [ -z "$2" ]; then
            echo "Usage: $0 open <feature-name>"
            echo "Example: $0 open homepage"
            exit 1
        fi
        open_feature "$2"
        ;;
    "create")
        if [ -z "$2" ]; then
            echo "Usage: $0 create <feature-name>"
            echo "Example: $0 create dashboard"
            exit 1
        fi
        create_feature "$2"
        ;;
    "dev")
        start_dev
        ;;
    "list")
        list_features
        ;;
    "workspace")
        open_workspace
        ;;
    *)
        echo "GhostNote Feature Development Commands:"
        echo ""
        echo "  $0 dev                    Start development server"
        echo "  $0 open <feature>         Open feature in VSCode"
        echo "  $0 create <feature>       Create new feature"
        echo "  $0 list                   List available features"
        echo "  $0 workspace              Open VSCode workspace"
        echo ""
        echo "Examples:"
        echo "  $0 dev                    # Start dev server"
        echo "  $0 open homepage          # Open homepage feature"
        echo "  $0 create my-feature      # Create new feature"
        echo "  $0 workspace              # Open full workspace"
        ;;
esac
