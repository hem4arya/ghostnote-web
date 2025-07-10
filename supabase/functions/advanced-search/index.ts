// Advanced search Edge Function
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

// Use a singleton pattern to load the model only once.
class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: Pipeline | null = null;

    static async getInstance(progress_callback: ProgressCallback | null = null): Promise<Pipeline> {
        if (this.instance === null) {
            try {
                // @ts-expect-error - External module import for Deno Edge Function
                const transformers = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/transformers.min.js');
                this.instance = await transformers.pipeline(this.task, this.model, { progress_callback });
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
  user_id?: string;
  category?: string;
  min_rating?: number;
  max_price?: number;
  match_threshold?: number;
  match_count?: number;
}

interface RankedNote {
  id: number;
  title: string;
  body: string;
  tags: string[];
  category: string;
  author: string;
  keywords: string[];
  price: number;
  purchase_count: number;
  view_count: number;
  rating: number;
  review_count: number;
  created_at: string;
  is_verified_creator: boolean;
  creator_trust_score: number;
  content_similarity: number;
  popularity_score: number;
  recency_score: number;
  creator_score: number;
  personalization_score: number;
  final_score: number;
}

interface TrendingNote {
  id: number;
  title: string;
  body: string;
  tags: string[];
  category: string;
  author: string;
  keywords: string[];
  price: number;
  purchase_count: number;
  view_count: number;
  rating: number;
  review_count: number;
  created_at: string;
  is_verified_creator: boolean;
  creator_trust_score: number;
  trending_score: number;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Extract the search parameters from the request body
    const searchRequest: SearchRequest = await req.json();
    const { 
      query, 
      user_id, 
      category, 
      min_rating = 0, 
      max_price = 999999, 
      match_threshold = 0.3, 
      match_count = 20 
    } = searchRequest;

    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create a Supabase client
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

    // Call the advanced search function
    const { data: rankedNotes, error } = await supabaseClient.rpc('advanced_search_notes', {
      query_embedding: embedding,
      search_query: query,
      user_id: user_id || null,
      match_threshold: match_threshold,
      match_count: match_count,
    });

    if (error) {
      console.error('Advanced search error:', error);
      throw error;
    }

    // Apply additional filters if specified
    let filteredNotes = rankedNotes as RankedNote[];
    
    if (category && category !== 'All') {
      filteredNotes = filteredNotes.filter(note => note.category === category);
    }
    
    if (min_rating > 0) {
      filteredNotes = filteredNotes.filter(note => note.rating >= min_rating);
    }
    
    if (max_price < 999999) {
      filteredNotes = filteredNotes.filter(note => note.price <= max_price);
    }

    // Track search analytics (if user is logged in)
    if (user_id) {
      await supabaseClient
        .from('search_analytics')
        .insert({
          query: query,
          user_id: user_id,
          results_count: filteredNotes.length
        });
    }

    // Fallback system: if results are too few or low quality, suggest trending notes
    let fallbackNotes: RankedNote[] = [];
    if (filteredNotes.length < 3 || (filteredNotes.length > 0 && filteredNotes[0].final_score < 0.4)) {
      const { data: trending, error: trendingError } = await supabaseClient
        .from('notes')
        .select(`
          id, title, body, tags, category, author, keywords, price,
          purchase_count, view_count, rating, review_count, created_at,
          is_verified_creator, creator_trust_score, trending_score
        `)
        .eq('is_public', true)
        .order('trending_score', { ascending: false })
        .limit(5);

      if (!trendingError && trending) {
        fallbackNotes = trending.map((note: TrendingNote) => ({
          ...note,
          content_similarity: 0,
          popularity_score: 0.8,
          recency_score: 0.5,
          creator_score: note.creator_trust_score,
          personalization_score: 0,
          final_score: note.trending_score / 100 // Normalize trending score
        }));
      }
    }

    // Prepare response with ranking explanation
    const response = {
      query: query,
      total_results: filteredNotes.length,
      search_results: filteredNotes.slice(0, match_count),
      fallback_results: fallbackNotes,
      ranking_factors: {
        content_match: '35%',
        popularity: '25%',
        recency: '15%',
        creator_trust: '15%',
        personalization: '10%'
      },
      search_metadata: {
        semantic_search: true,
        personalized: !!user_id,
        filters_applied: {
          category: category || 'none',
          min_rating: min_rating,
          max_price: max_price === 999999 ? 'none' : max_price
        }
      }
    };

    return new Response(
      JSON.stringify(response),
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
