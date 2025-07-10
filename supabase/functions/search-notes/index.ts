import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/transformers.min.js';

// Use a singleton pattern to load the model only once.
class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

Deno.serve(async (req: any) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract the search query from the request body
    const { query } = await req.json();

    // Create a Supabase client with the user's authorization
    const supabaseClient = new SupabaseClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
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
      match_threshold: 0.7, // Adjust this threshold as needed
      match_count: 10,
    });

    if (error) {
      throw error;
    }

    // Return the matched notes
    return new Response(
      JSON.stringify({ notes }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
