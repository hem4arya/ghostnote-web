// Search notes Edge Function
// @ts-expect-error - Supabase import for Deno Edge Function
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-expect-error - CORS import for Deno Edge Function
import { corsHeaders } from '../_shared/cors.ts';

// Declare Deno global for Edge Functions
declare const Deno: {
  serve: (handler: (request: Request) => Response | Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
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

interface SearchRequest {
  query: string;
  match_threshold?: number;
  match_count?: number;
}

interface Note {
  id: number;
  title: string;
  body: string;
  tags: string[];
  category: string;
  author: string;
  price: number;
  rating: number;
  review_count: number;
  created_at: string;
  similarity: number;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract the search query from the request body
    const requestBody: SearchRequest = await req.json();
    const { query, match_threshold = 0.7, match_count = 10 } = requestBody;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required and must be a non-empty string' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create a Supabase client with the user's authorization
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: req.headers.get('Authorization') || '' } 
        } 
      }
    );

    // Generate the embedding for the search query
    const extractor = await PipelineSingleton.getInstance();
    const output = await extractor(query, {
      pooling: 'mean',
      normalize: true,
    });
    const embedding = Array.from(output.data);

    // Query the database for similar notes
    const { data: notes, error } = await supabaseClient.rpc('match_notes', {
      query_embedding: embedding,
      match_threshold: match_threshold,
      match_count: match_count,
    });

    if (error) {
      console.error('Database search error:', error);
      throw error;
    }

    const searchResults = (notes as Note[]) || [];

    // Return the matched notes with search metadata
    return new Response(
      JSON.stringify({ 
        query: query,
        notes: searchResults,
        total_results: searchResults.length,
        search_metadata: {
          match_threshold: match_threshold,
          match_count: match_count,
          embedding_dimensions: embedding.length,
          semantic_search: true
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Search function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Search failed',
        details: errorMessage
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
