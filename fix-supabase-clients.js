#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files that need to be updated
const filesToUpdate = [
  'src/components/create/components/CreateNoteForm.tsx',
  'src/components/dashboard/components/DashboardTabs.tsx',
  'src/components/dashboard/components/PersonalizedRecommendations.tsx',
  'src/components/note-card/NoteCard.tsx',
  'src/components/note-detail/hooks/useNoteDetail.ts',
  'src/components/note-detail/NoteDetailPage.tsx'
];

const replacements = [
  {
    from: /import { createClientComponentClient } from '@supabase\/auth-helpers-nextjs';/g,
    to: "import { getSupabaseClient } from '../../../../lib/supabase';"
  },
  {
    from: /import { createClientComponentClient } from '@supabase\/auth-helpers-nextjs';/g,
    to: "import { getSupabaseClient } from '../../../lib/supabase';"
  },
  {
    from: /const supabase = createClientComponentClient\(\{[\s\S]*?\}\);/g,
    to: "const supabase = getSupabaseClient();"
  }
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Determine correct import path based on file location
    const depth = file.split('/').length - 2; // subtract 1 for filename and 1 for src
    const importPath = '../'.repeat(depth) + 'lib/supabase';
    
    // Replace import
    content = content.replace(
      /import { createClientComponentClient } from '@supabase\/auth-helpers-nextjs';/g,
      `import { getSupabaseClient } from '${importPath}';`
    );
    
    // Replace client creation
    content = content.replace(
      /const supabase = createClientComponentClient\(\{[\s\S]*?\}\);/g,
      "const supabase = getSupabaseClient();"
    );
    
    fs.writeFileSync(fullPath, content);
    console.log(`Updated: ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Batch update completed!');
