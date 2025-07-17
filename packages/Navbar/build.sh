#!/bin/bash

echo "🚀 Building Navbar package..."

# Ensure we have the latest dependencies
echo "📦 Installing dependencies..."
pnpm install

# Run TypeScript build
echo "🔧 Building TypeScript..."
pnpm build

# Run type checking
echo "🔍 Running type checking..."
pnpm type-check

# Run linting
echo "🧹 Running linter..."
pnpm lint

echo "✅ Navbar package built successfully!"
