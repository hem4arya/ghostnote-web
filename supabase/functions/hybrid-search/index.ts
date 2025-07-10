// Deno edge function for hybrid search
// @ts-expect-error - Supabase CDN import for Deno Edge Function
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// @ts-expect-error - Deno Edge Function CORS import
import { corsHeaders } from '../_shared/cors.ts';

// Declare Deno global for Edge Functions
declare const Deno: {
  serve: (handler: (request: Request) => Response | Promise<Response>) => void;
  env: {
    get: (key: string) => string | undefined;
  };
};

// Define types for Supabase client
type SupabaseClient = ReturnType<typeof createClient>;

// Define types for the ML pipeline with proper error handling
interface PipelineOutput {
  data: Float32Array | number[];
}

interface Pipeline {
  (text: string, options?: { pooling: string; normalize: boolean }): Promise<PipelineOutput>;
}

interface ProgressCallback {
  (progress: { progress: number; loaded: number; total: number }): void;
}

// Interface for dynamic transformers module
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
                // Dynamic import for Edge Function compatibility with proper typing
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
        
        // Type assertion since we check for null above
        return this.instance as Pipeline;
    }
}

interface HybridSearchRequest {
  query: string;
  user_id?: string;
  category?: string;
  min_rating?: number;
  max_price?: number;
  search_type?: 'semantic' | 'fulltext' | 'fuzzy' | 'hybrid';
  match_threshold?: number;
  match_count?: number;
  include_analytics?: boolean;
}

interface SearchResult {
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
  semantic_score: number;
  fulltext_score: number;
  fuzzy_score: number;
  combined_score: number;
  trending_score?: number;
  is_fallback?: boolean;
}

interface TrendingNote {
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
  trending_score: number;
}


Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    // Extract the search parameters from the request body
    const searchRequest: HybridSearchRequest = await req.json();
    const { 
      query, 
      user_id, 
      category, 
      min_rating = 0, 
      max_price = 999999, 
      search_type = 'hybrid',
      match_threshold = 0.3, 
      match_count = 20,
      include_analytics = true
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

    let queryEmbedding = null;

    // Generate embedding for semantic search (if needed)
    if (search_type === 'semantic' || search_type === 'hybrid') {
      try {
        const extractor = await PipelineSingleton.getInstance();
        const output = await extractor(query, {
          pooling: 'mean',
          normalize: true,
        });
        queryEmbedding = Array.from(output.data);
      } catch (embeddingError) {
        console.warn('Embedding generation failed, falling back to non-semantic search:', embeddingError);
        // Continue without semantic search if embedding fails
      }
    }

    // Call the hybrid search function
    const { data: searchResults, error } = await supabaseClient.rpc('hybrid_search_notes', {
      search_query: query,
      query_embedding: queryEmbedding,
      category_filter: category || null,
      min_rating: min_rating,
      max_price: max_price,
      match_threshold: match_threshold,
      match_count: match_count,
      search_type: search_type
    });

    if (error) {
      console.error('Hybrid search error:', error);
      throw error;
    }

    const results = (searchResults as SearchResult[]) || [];
    const executionTime = Date.now() - startTime;

    // Track search analytics if requested and user is provided
    if (include_analytics) {
      try {
        await supabaseClient
          .from('search_performance')
          .insert({
            query: query,
            search_type: search_type,
            results_count: results.length,
            execution_time_ms: executionTime,
            user_id: user_id || null
          });
      } catch (analyticsError) {
        console.warn('Failed to save search analytics:', analyticsError);
        // Don't fail the request if analytics fails
      }
    }

    // Fallback system: if results are too few or low quality, suggest trending notes
    let fallbackResults: SearchResult[] = [];
    const needsFallback = results.length < 3 || 
                         (results.length > 0 && results[0].combined_score < 0.3);

    if (needsFallback) {
      const { data: trending, error: trendingError } = await supabaseClient
        .from('notes')
        .select(`
          id, title, body, tags, category, author, price,
          rating, review_count, created_at, trending_score
        `)
        .eq('is_public', true)
        .order('trending_score', { ascending: false })
        .limit(5);

      if (!trendingError && trending) {
        fallbackResults = trending.map((note: TrendingNote) => ({
          ...note,
          semantic_score: 0,
          fulltext_score: 0,
          fuzzy_score: 0,
          combined_score: note.trending_score / 100,
          is_fallback: true
        }));
      }
    }

    // Get search suggestions based on query patterns
    const searchSuggestions = await getSearchSuggestions(supabaseClient, query);

    // Prepare comprehensive response
    const response = {
      query: query,
      search_type: search_type,
      execution_time_ms: executionTime,
      total_results: results.length,
      search_results: results.slice(0, match_count),
      fallback_results: fallbackResults,
      search_suggestions: searchSuggestions,
      search_metadata: {
        used_semantic: queryEmbedding !== null,
        used_fulltext: ['fulltext', 'hybrid'].includes(search_type),
        used_fuzzy: ['fuzzy', 'hybrid'].includes(search_type),
        filters_applied: {
          category: category || null,
          min_rating: min_rating > 0 ? min_rating : null,
          max_price: max_price < 999999 ? max_price : null
        }
      },
      performance_tips: generatePerformanceTips(results, executionTime, search_type)
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Hybrid search function error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: errorMessage,
        search_fallback: 'Please try a simpler search query'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Helper function to get search suggestions
async function getSearchSuggestions(supabase: SupabaseClient, query: string) {
  try {
    // Get popular search terms from analytics
    const { data: popularQueries, error } = await supabase
      .from('search_performance')
      .select('query, COUNT(*) as frequency')
      .ilike('query', `%${query.split(' ')[0]}%`)
      .order('frequency', { ascending: false })
      .limit(3);

    if (error) throw error;

    // Get related categories
    const { data: relatedCategories, error: catError } = await supabase
      .from('categories')
      .select('name, note_count')
      .order('note_count', { ascending: false })
      .limit(5);

    if (catError) throw catError;

    // Get trending tags
    const { data: trendingTags, error: tagError } = await supabase
      .from('tags')
      .select('name, usage_count')
      .order('usage_count', { ascending: false })
      .limit(8);

    if (tagError) throw tagError;

    return {
      popular_queries: popularQueries?.map((q: { query: string; frequency: number }) => q.query) || [],
      related_categories: relatedCategories?.map((c: { name: string; note_count: number }) => c.name) || [],
      trending_tags: trendingTags?.map((t: { name: string; usage_count: number }) => t.name) || []
    };
  } catch (error) {
    console.warn('Failed to get search suggestions:', error);
    return {
      popular_queries: [],
      related_categories: [],
      trending_tags: []
    };
  }
}

// Helper function to generate performance tips
function generatePerformanceTips(results: SearchResult[], executionTime: number, searchType: string) {
  const tips = [];

  if (executionTime > 200) {
    tips.push('Consider using more specific search terms to improve performance');
  }

  if (results.length === 0) {
    tips.push('Try broader search terms or check spelling');
    tips.push('Consider browsing categories or trending content');
  }

  if (results.length > 50) {
    tips.push('Use filters to narrow down results');
  }

  if (searchType === 'semantic' && results.length < 5) {
    tips.push('Try switching to keyword search for more results');
  }

  if (searchType === 'fulltext' && results.some(r => r.combined_score < 0.5)) {
    tips.push('Try semantic search for better content matching');
  }

  return tips;
}
