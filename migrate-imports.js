import fs from 'fs';
// Removed unused 'path' import

const COMPONENT_MAP = {
  'button': '@shared/ui/components/button',
  'badge': '@shared/ui/components/badge',
  'label': '@shared/ui/components/label',
  'separator': '@shared/ui/components/separator',
  'input': '@shared/ui/components/input',
  'card': '@shared/ui/components/card',
  'textarea': '@shared/ui/components/textarea',
  'dialog': '@shared/ui/components/dialog',
  'switch': '@shared/ui/components/switch',
  'select': '@shared/ui/components/select',
  'progress': '@shared/ui/components/progress',
  // Add more components as they get migrated
};

const updateImports = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    Object.entries(COMPONENT_MAP).forEach(([comp, newPath]) => {
      // Pattern for @/components/ui/component imports
      const regex1 = new RegExp(`from ['"]@/components/ui/${comp}['"]`, 'g');
      if (regex1.test(content)) {
        content = content.replace(regex1, `from '${newPath}'`);
        hasChanges = true;
      }
      
      // Pattern for ./ui/component imports  
      const regex2 = new RegExp(`from ['"]\\./ui/${comp}['"]`, 'g');
      if (regex2.test(content)) {
        content = content.replace(regex2, `from '${newPath}'`);
        hasChanges = true;
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated imports in: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
  }
};

// Files that need import migration
const filesToMigrate = [
  'src/components/SmartSearch.tsx',
  'src/components/SmartSearchDropdown.tsx',
  'src/components/PrivateAccountSetup.tsx',
  'src/components/CreatorCloneDashboard.tsx',
  'src/components/CloneWarningModal.tsx',
  'src/components/CloneAlerts.tsx',
  'src/components/AdvancedSmartSearch.tsx',
  'src/components/AuthModal.tsx',
  'src/components/AuthForm.tsx',
  'src/components/PremiumSearchExperienceFixed.tsx',
  'src/components/PremiumSearchExperience.tsx',
  'src/components/HybridSmartSearch.tsx',
  'src/components/HybridSmartSearchFixed.tsx',
  'src/components/NoteEditor.tsx',
  'src/components/Hero.tsx',
  'src/app/reader/[id]/page.tsx',
  'src/app/notes/[id]/page.tsx',
  'src/app/test-advanced-search/page.tsx',
  'src/app/demo/page.tsx',
  'src/app/dashboard/creator-protection/page.tsx',
];

console.log('🚀 Starting automated import migration...\n');

filesToMigrate.forEach(updateImports);

console.log('\n✨ Migration complete!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm run build');
console.log('2. Test key UI components work correctly');
console.log('3. Commit changes if all tests pass');
