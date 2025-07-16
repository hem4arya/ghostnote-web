#!/usr/bin/env node

import { promises as fs } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Common Lucide icons that need React 19 compatibility fixes
const COMMON_ICONS = [
  "ArrowLeft",
  "ArrowRight",
  "Check",
  "CheckCircle",
  "ChevronDown",
  "ChevronLeft",
  "ChevronRight",
  "ChevronUp",
  "Download",
  "Edit",
  "Eye",
  "EyeOff",
  "Heart",
  "Home",
  "Image",
  "Link",
  "Lock",
  "Mail",
  "Menu",
  "MoreVertical",
  "Plus",
  "Save",
  "Search",
  "Settings",
  "Share",
  "Share2",
  "ShoppingCart",
  "Star",
  "Trash",
  "User",
  "X",
  "BookOpen",
  "Bookmark",
  "Flag",
  "Shield",
  "Upload",
  "Calendar",
  "Clock",
  "Type",
  "AlignLeft",
  "Bold",
  "Italic",
  "Underline",
  "List",
  "FileText",
  "Code",
  "Quote",
  "Smile",
  "Camera",
  "Mic",
  "Volume2",
  "VolumeX",
];

/**
 * Fix React 19 JSX compatibility for Lucide icons
 */
async function fixIconsInFile(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf8");
    let modifiedContent = content;
    let hasChanges = false;

    // Check if file imports from lucide-react
    const lucideImportRegex =
      /import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]lucide-react['"];?/g;
    const matches = [...content.matchAll(lucideImportRegex)];

    if (matches.length === 0) {
      return false; // No lucide-react imports found
    }

    for (const match of matches) {
      const importedIcons = match[1]
        .split(",")
        .map((icon) => icon.trim())
        .filter((icon) => icon && COMMON_ICONS.includes(icon));

      if (importedIcons.length === 0) {
        continue;
      }

      // Create compatibility wrappers
      const wrappers = importedIcons
        .map((icon) => `const ${icon}Icon = ${icon} as React.ElementType;`)
        .join("\n");

      const wrapperBlock = `\n// React 19 compatibility wrappers\n${wrappers}\n`;

      // Replace the import and add wrappers
      const newImport = match[0] + wrapperBlock;
      modifiedContent = modifiedContent.replace(match[0], newImport);

      // Replace icon usage in JSX
      for (const icon of importedIcons) {
        // Pattern: <IconName with various props
        const iconRegex = new RegExp(
          `<${icon}(\\s+[^>]*)?(/?>|>[^<]*</${icon}>)`,
          "g"
        );
        modifiedContent = modifiedContent.replace(
          iconRegex,
          `<${icon}Icon$1$2`
        );
      }

      hasChanges = true;
    }

    if (hasChanges) {
      await fs.writeFile(filePath, modifiedContent);
      console.log(`✅ Fixed icons in: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Recursively find all .tsx and .ts files
 */
async function findTypeScriptFiles(dir) {
  const files = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (
        entry.isDirectory() &&
        entry.name !== "node_modules" &&
        entry.name !== ".next"
      ) {
        files.push(...(await findTypeScriptFiles(fullPath)));
      } else if (
        entry.isFile() &&
        (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))
      ) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`❌ Error reading directory ${dir}:`, error.message);
  }

  return files;
}

/**
 * Main function
 */
async function main() {
  const rootDir = path.join(__dirname, "..");
  const packagesDir = path.join(rootDir, "packages");

  console.log("🔧 Starting React 19 icon compatibility fixes...\n");

  try {
    // Get all packages
    const packages = await fs.readdir(packagesDir, { withFileTypes: true });
    let totalFixed = 0;

    for (const pkg of packages) {
      if (!pkg.isDirectory()) continue;

      const packagePath = path.join(packagesDir, pkg.name);
      console.log(`📦 Processing package: ${pkg.name}`);

      // Find all TypeScript files in the package
      const tsFiles = await findTypeScriptFiles(packagePath);

      let packageFixed = 0;
      for (const file of tsFiles) {
        const wasFixed = await fixIconsInFile(file);
        if (wasFixed) {
          packageFixed++;
          totalFixed++;
        }
      }

      if (packageFixed > 0) {
        console.log(`   ✅ Fixed ${packageFixed} files in ${pkg.name}`);
      } else {
        console.log(`   ⏭️  No icon fixes needed in ${pkg.name}`);
      }
    }

    console.log(`\n🎉 React 19 icon compatibility fixes completed!`);
    console.log(`📊 Total files fixed: ${totalFixed}`);

    if (totalFixed > 0) {
      console.log(`\n💡 Next steps:`);
      console.log(`   1. Run 'pnpm build' to verify fixes`);
      console.log(`   2. Test components to ensure icons render correctly`);
    }
  } catch (error) {
    console.error("❌ Error during icon fixes:", error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { findTypeScriptFiles, fixIconsInFile };
