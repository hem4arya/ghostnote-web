// Generate embedding Edge Function
// @ts-expect-error - External ML module import for Deno Edge Function
import { corsHeaders } from '../_shared/cors.ts';

// Declare Deno global for Edge Functions
declare const Deno: {
  serve: (handler: (request: Request) => Response | Promise<Response>) => void;
};

// Define types for the ML pipeline
interface PipelineOutput {
  data: Float32Array | number[];
}

interface Pipeline {
  (text: string, options?: { pooling: string; normalize: boolean }): Promise<PipelineOutput>;
}

interface ProgressCallback {
  (progress: { progress: number; loaded: number; total: number }): void;
}

interface TransformersModule {
  pipeline?: (task: string, model: string, options: { progress_callback?: ProgressCallback | null }) => Promise<Pipeline>;
  default?: {
    pipeline?: (task: string, model: string, options: { progress_callback?: ProgressCallback | null }) => Promise<Pipeline>;
  };
}

// Use a singleton pattern to load the model only once.
class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: Pipeline | null = null;

    static async getInstance(progress_callback: ProgressCallback | null = null): Promise<Pipeline> {
        if (this.instance === null) {
            try {
                // @ts-expect-error - External module import for Deno Edge Function
                const transformers = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/transformers.min.js') as TransformersModule;
                
                // Extract pipeline function from the module
                const pipeline = transformers.pipeline || transformers.default?.pipeline;
                if (!pipeline) {
                    throw new Error('Pipeline function not found in transformers module');
                }
                
                this.instance = await pipeline(this.task, this.model, { progress_callback });
            } catch (error) {
                console.error('Failed to load ML pipeline:', error);
                throw new Error('ML pipeline initialization failed');
            }
        }
        return this.instance as Pipeline;
    }
}

interface EmbeddingRequest {
  text: string;
}

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract input text from the request body
    const requestBody: EmbeddingRequest = await req.json();
    const { text } = requestBody;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Text parameter is required and must be a non-empty string' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get the pipeline instance
    const extractor = await PipelineSingleton.getInstance();

    // Generate the embedding
    const output = await extractor(text, {
      pooling: 'mean',
      normalize: true,
    });

    // Extract the embedding from the output
    const embedding = Array.from(output.data);

    // Return the embedding
    return new Response(
      JSON.stringify({ 
        embedding,
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''), // Echo back truncated text for confirmation
        dimensions: embedding.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Embedding generation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate embedding',
        details: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
