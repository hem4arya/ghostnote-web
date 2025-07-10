// Deno type declarations for Edge Functions
declare global {
  namespace Deno {
    export function serve(handler: (request: Request) => Response | Promise<Response>): void;
    export const env: {
      get(key: string): string | undefined;
    };
  }
}

export {};
