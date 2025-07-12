#!/usr/bin/env node

/**
 * Feature Structure Verification Script
 * Verifies that the feature-based architecture is properly set up
 */

import fs from 'fs';
import path from 'path';

const features = ['search', 'transparency'];
const requiredFiles = [
  'index.ts',
  'tsconfig.json',
  'README.md',
  'components',
  'hooks',
  'utils',
  'types'
];

const requiredDirs = ['components', 'hooks', 'utils', 'types'];

console.log('🔍 Verifying Feature Structure...\n');

let allValid = true;

features.forEach(feature => {
  console.log(`📁 Checking feature: ${feature}`);
  const featurePath = path.join('src', 'features', feature);
  
  if (!fs.existsSync(featurePath)) {
    console.log(`  ❌ Feature directory not found: ${featurePath}`);
    allValid = false;
    return;
  }
  
  // Check required files and directories
  requiredFiles.forEach(item => {
    const itemPath = path.join(featurePath, item);
    const exists = fs.existsSync(itemPath);
    const isDir = requiredDirs.includes(item);
    const icon = exists ? '✅' : '❌';
    const type = isDir ? 'directory' : 'file';
    
    console.log(`  ${icon} ${type}: ${item}`);
    if (!exists) allValid = false;
  });
  
  // Check workspace file
  const workspacePath = path.join(featurePath, `${feature}.code-workspace`);
  const workspaceExists = fs.existsSync(workspacePath);
  console.log(`  ${workspaceExists ? '✅' : '❌'} workspace: ${feature}.code-workspace`);
  if (!workspaceExists) allValid = false;
  
  console.log('');
});

// Check shared components
console.log('📁 Checking shared components');
const sharedComponents = [
  'src/components/SmartSearchDropdown.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx'
];

sharedComponents.forEach(component => {
  const exists = fs.existsSync(component);
  console.log(`  ${exists ? '✅' : '❌'} ${component}`);
  if (!exists) allValid = false;
});

console.log('');

// Check tsconfig.json
console.log('📁 Checking TypeScript configuration');
const rootTsconfigPath = 'tsconfig.json';
if (fs.existsSync(rootTsconfigPath)) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync(rootTsconfigPath, 'utf8'));
    const hasBaseUrl = tsconfig.compilerOptions?.baseUrl === 'src';
    const hasPaths = tsconfig.compilerOptions?.paths?.['@/*'];
    
    console.log(`  ${hasBaseUrl ? '✅' : '❌'} baseUrl: "src"`);
    console.log(`  ${hasPaths ? '✅' : '❌'} paths: "@/*"`);
    
    if (!hasBaseUrl || !hasPaths) allValid = false;
  } catch (error) {
    console.log('  ❌ Failed to parse tsconfig.json');
    console.log(`     Error: ${error.message}`);
    allValid = false;
  }
} else {
  console.log('  ❌ tsconfig.json not found');
  allValid = false;
}

console.log('\n' + '='.repeat(50));

if (allValid) {
  console.log('🎉 Feature structure verification PASSED!');
  console.log('✅ All features are properly configured');
  console.log('✅ Ready for isolated development');
} else {
  console.log('❌ Feature structure verification FAILED!');
  console.log('⚠️  Some components are missing or misconfigured');
  process.exit(1);
}

console.log('\n📖 Next steps:');
console.log('1. Open a feature workspace: code src/features/search/search.code-workspace');
console.log('2. Run feature development: npm run dev');
console.log('3. Check FEATURE_STRUCTURE.md for detailed documentation');
