#!/usr/bin/env tsx

import { spawn } from "child_process";
import { promises as fs } from "fs";
import * as path from "path";

interface FeatureConfig {
  name: string;
  description: string;
  hasApi?: boolean;
  hasDatabase?: boolean;
  dependencies?: string[];
}

const TEMPLATE_PACKAGE_JSON = {
  name: "@ghostnote/{name}",
  version: "1.0.0",
  description: "{description}",
  main: "index.ts",
  types: "index.ts",
  scripts: {
    build: "tsc",
    dev: "tsc --watch",
    lint: "eslint src/**/*.{ts,tsx}",
    "type-check": "tsc --noEmit",
  },
  dependencies: {
    "@ghostnote/ui-components": "workspace:*",
    "@ghostnote/shared-lib": "workspace:*",
  },
  devDependencies: {
    "@types/react": "^19",
    typescript: "^5",
    eslint: "^9",
  },
};

const TEMPLATE_TSCONFIG = {
  extends: "../../tsconfig.base.json",
  compilerOptions: {
    outDir: "./dist",
    rootDir: "./src",
    composite: true,
    declarationMap: true,
  },
  include: ["src/**/*"],
  exclude: ["node_modules", "dist", "**/*.test.*"],
  references: [{ path: "../shared-lib" }, { path: "../ui-components" }],
};

const TEMPLATE_INDEX_TS = `// Export all components and utilities from this package
export * from './components';
export * from './hooks';
export * from './utils';
export * from './types';
`;

const TEMPLATE_README = `# {name}

{description}

## Installation

This package is part of the GhostNote monorepo and should be installed from the workspace root:

\`\`\`bash
pnpm install
\`\`\`

## Usage

\`\`\`typescript
import {{ Component }} from '@features/{name}';

// Use the component
<Component />
\`\`\`

## Development

Run the package in development mode:

\`\`\`bash
pnpm dev
\`\`\`

Build the package:

\`\`\`bash
pnpm build
\`\`\`

## Structure

- \`src/components/\` - React components
- \`src/hooks/\` - Custom React hooks  
- \`src/utils/\` - Utility functions
- \`src/types/\` - TypeScript type definitions
- \`src/api/\` - API integration (if applicable)
`;

const TEMPLATE_COMPONENT_INDEX = `// Export all components from this package
export { default as ExampleComponent } from './ExampleComponent';
`;

const TEMPLATE_EXAMPLE_COMPONENT = `import React from 'react';

interface ExampleComponentProps {
  title?: string;
  children?: React.ReactNode;
}

const ExampleComponent: React.FC<ExampleComponentProps> = ({ 
  title = 'Example Component',
  children 
}) => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
};

export default ExampleComponent;
`;

const TEMPLATE_HOOKS_INDEX = `// Export all hooks from this package
export { default as useExample } from './useExample';
`;

const TEMPLATE_USE_EXAMPLE = `import { useState, useEffect } from 'react';

interface UseExampleReturn {
  value: string;
  setValue: (value: string) => void;
  isLoading: boolean;
}

const useExample = (initialValue: string = ''): UseExampleReturn => {
  const [value, setValue] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Example side effect
    console.log('Value changed:', value);
  }, [value]);

  return {
    value,
    setValue,
    isLoading
  };
};

export default useExample;
`;

const TEMPLATE_UTILS_INDEX = `// Export all utilities from this package
export * from './helpers';
`;

const TEMPLATE_HELPERS = `/**
 * Example utility function
 */
export const formatString = (str: string): string => {
  return str.trim().toLowerCase();
};

/**
 * Example async utility
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
`;

const TEMPLATE_TYPES_INDEX = `// Export all types from this package
export interface ExampleType {
  id: string;
  name: string;
  createdAt: Date;
}

export type ExampleStatus = 'pending' | 'active' | 'inactive';
`;

const TEMPLATE_WORKSPACE = `{
  "folders": [
    {
      "name": "{name}",
      "path": "packages/{name}"
    }
  ],
  "settings": {
    "typescript.tsdk": "node_modules/typescript/lib",
    "typescript.preferences.includePackageJsonAutoImports": "on",
    "typescript.suggest.autoImports": true,
    "eslint.workingDirectories": ["packages/{name}"],
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": "explicit",
      "source.organizeImports": "explicit"
    },
    "files.exclude": {
      "**/node_modules": true,
      "**/.next": true,
      "**/dist": true
    }
  },
  "extensions": {
    "recommendations": [
      "bradlc.vscode-tailwindcss",
      "esbenp.prettier-vscode", 
      "dbaeumer.vscode-eslint",
      "ms-vscode.vscode-typescript-next"
    ]
  }
}`;

async function createFeaturePackage(config: FeatureConfig): Promise<void> {
  const packagePath = path.join(process.cwd(), "packages", config.name);

  try {
    // Create package directory structure
    await fs.mkdir(packagePath, { recursive: true });
    await fs.mkdir(path.join(packagePath, "src"), { recursive: true });
    await fs.mkdir(path.join(packagePath, "src", "components"), {
      recursive: true,
    });
    await fs.mkdir(path.join(packagePath, "src", "hooks"), { recursive: true });
    await fs.mkdir(path.join(packagePath, "src", "utils"), { recursive: true });
    await fs.mkdir(path.join(packagePath, "src", "types"), { recursive: true });

    if (config.hasApi) {
      await fs.mkdir(path.join(packagePath, "src", "api"), { recursive: true });
    }

    // Create package.json
    const packageJson = { ...TEMPLATE_PACKAGE_JSON };
    packageJson.name = packageJson.name.replace("{name}", config.name);
    packageJson.description = packageJson.description.replace(
      "{description}",
      config.description
    );

    if (config.dependencies) {
      config.dependencies.forEach((dep) => {
        packageJson.dependencies[dep] = "workspace:*";
      });
    }

    await fs.writeFile(
      path.join(packagePath, "package.json"),
      JSON.stringify(packageJson, null, 2)
    );

    // Create tsconfig.json
    await fs.writeFile(
      path.join(packagePath, "tsconfig.json"),
      JSON.stringify(TEMPLATE_TSCONFIG, null, 2)
    );

    // Create index.ts
    await fs.writeFile(path.join(packagePath, "index.ts"), TEMPLATE_INDEX_TS);

    // Create README.md
    const readme = TEMPLATE_README.replace(/\{name\}/g, config.name).replace(
      /\{description\}/g,
      config.description
    );
    await fs.writeFile(path.join(packagePath, "README.md"), readme);

    // Create source files
    await fs.writeFile(
      path.join(packagePath, "src", "components", "index.ts"),
      TEMPLATE_COMPONENT_INDEX
    );

    await fs.writeFile(
      path.join(packagePath, "src", "components", "ExampleComponent.tsx"),
      TEMPLATE_EXAMPLE_COMPONENT
    );

    await fs.writeFile(
      path.join(packagePath, "src", "hooks", "index.ts"),
      TEMPLATE_HOOKS_INDEX
    );

    await fs.writeFile(
      path.join(packagePath, "src", "hooks", "useExample.ts"),
      TEMPLATE_USE_EXAMPLE
    );

    await fs.writeFile(
      path.join(packagePath, "src", "utils", "index.ts"),
      TEMPLATE_UTILS_INDEX
    );

    await fs.writeFile(
      path.join(packagePath, "src", "utils", "helpers.ts"),
      TEMPLATE_HELPERS
    );

    await fs.writeFile(
      path.join(packagePath, "src", "types", "index.ts"),
      TEMPLATE_TYPES_INDEX
    );

    // Create workspace file
    const workspace = TEMPLATE_WORKSPACE.replace(/\{name\}/g, config.name);
    await fs.writeFile(
      path.join(process.cwd(), `${config.name}.code-workspace`),
      workspace
    );

    console.log(`✅ Successfully created feature package: ${config.name}`);
    console.log(`📁 Package location: ${packagePath}`);
    console.log(`🔧 Workspace file: ${config.name}.code-workspace`);
  } catch (error) {
    console.error(`❌ Error creating feature package: ${error}`);
    throw error;
  }
}

async function updateRootTsConfig(featureName: string): Promise<void> {
  try {
    // Update tsconfig.base.json with path aliases
    const tsConfigBasePath = path.join(process.cwd(), "tsconfig.base.json");
    const tsConfigBaseContent = await fs.readFile(tsConfigBasePath, "utf8");
    const tsConfigBase = JSON.parse(tsConfigBaseContent);

    // Add path alias
    if (!tsConfigBase.compilerOptions.paths) {
      tsConfigBase.compilerOptions.paths = {};
    }
    tsConfigBase.compilerOptions.paths[`@features/${featureName}/*`] = [
      `packages/${featureName}/src/*`,
    ];
    tsConfigBase.compilerOptions.paths[`@features/${featureName}`] = [
      `packages/${featureName}/index.ts`,
    ];

    await fs.writeFile(tsConfigBasePath, JSON.stringify(tsConfigBase, null, 2));
    console.log(
      `✅ Updated tsconfig.base.json with aliases for ${featureName}`
    );

    // Update root tsconfig.json with project reference
    const tsConfigPath = path.join(process.cwd(), "tsconfig.json");
    const tsConfigContent = await fs.readFile(tsConfigPath, "utf8");
    const tsConfig = JSON.parse(tsConfigContent);

    // Add project reference
    if (!tsConfig.references) {
      tsConfig.references = [];
    }

    const newReference = { path: `packages/${featureName}` };
    const existingRef = tsConfig.references.find(
      (ref) => ref.path === newReference.path
    );

    if (!existingRef) {
      tsConfig.references.push(newReference);
      tsConfig.references.sort((a, b) => a.path.localeCompare(b.path));
      await fs.writeFile(tsConfigPath, JSON.stringify(tsConfig, null, 2));
      console.log(
        `✅ Added project reference for ${featureName} to tsconfig.json`
      );
    }
  } catch (error) {
    console.error(`❌ Error updating TypeScript configuration: ${error}`);
  }
}

async function runPnpmInstall(): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["install"], {
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log("✅ Dependencies installed successfully");
        resolve();
      } else {
        reject(new Error(`pnpm install failed with code ${code}`));
      }
    });
  });
}

// CLI Interface
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🚀 GhostNote Feature Generator

Usage: 
  pnpm create-feature <name> [description] [options]

Examples:
  pnpm create-feature billing "Billing and payments feature"
  pnpm create-feature analytics "Analytics dashboard" --api --database
  
Options:
  --api        Include API integration scaffolding
  --database   Include database schema scaffolding
  --deps       Additional workspace dependencies (comma-separated)

Available Commands:
  help         Show this help message
`);
    return;
  }

  if (args[0] === "help") {
    console.log("Feature generator help displayed above");
    return;
  }

  const featureName = args[0];
  const description = args[1] || `${featureName} feature package`;

  const config: FeatureConfig = {
    name: featureName,
    description: description,
    hasApi: args.includes("--api"),
    hasDatabase: args.includes("--database"),
  };

  // Parse dependencies
  const depsIndex = args.indexOf("--deps");
  if (depsIndex !== -1 && args[depsIndex + 1]) {
    config.dependencies = args[depsIndex + 1]
      .split(",")
      .map((dep) => dep.trim());
  }

  console.log(`🔨 Creating feature package: ${featureName}`);
  console.log(`📝 Description: ${description}`);
  if (config.hasApi) console.log("🔌 Including API scaffolding");
  if (config.hasDatabase) console.log("🗄️  Including database scaffolding");
  if (config.dependencies)
    console.log(
      `📦 Additional dependencies: ${config.dependencies.join(", ")}`
    );

  try {
    await createFeaturePackage(config);
    await updateRootTsConfig(featureName);
    console.log("📦 Installing dependencies...");
    await runPnpmInstall();

    console.log(`
🎉 Feature package '${featureName}' created successfully!

Next steps:
1. Open the workspace file: code ${featureName}.code-workspace
2. Start developing: cd packages/${featureName}
3. Run in dev mode: pnpm dev
4. Build the package: pnpm build

Happy coding! 🚀
`);
  } catch (error) {
    console.error("❌ Failed to create feature package:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { createFeaturePackage, FeatureConfig };
