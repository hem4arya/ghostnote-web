// Type declarations for Supabase Edge Functions (Deno runtime)
// This file suppresses TypeScript errors during development

declare global {
  const Deno: {
    serve: (handler: (req: Request) => Promise<Response> | Response) => void;
    env: {
      get: (key: string) => string | undefined;
    };
  };
}

// Export to make this a module
export {};
