#!/usr/bin/env node

/**
 * Clear Next.js Cache Script
 * Run this when you encounter hot reload issues
 */

const fs = require('fs');
const path = require('path');

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`✅ Deleted: ${folderPath}`);
  } else {
    console.log(`ℹ️  Not found: ${folderPath}`);
  }
}

console.log('🧹 Clearing Next.js cache...\n');

// Clear Next.js build cache
deleteFolderRecursive('.next');

// Clear node_modules cache (optional)
// deleteFolderRecursive('node_modules/.cache');

console.log('\n✨ Cache cleared! You can now run:');
console.log('   npm run dev');
console.log('\n💡 If you still have issues, also try:');
console.log('   npm install');