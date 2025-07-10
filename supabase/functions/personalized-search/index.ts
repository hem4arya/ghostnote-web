// Personalized Search Edge Function
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

// Singleton pattern for ML model
class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: Pipeline | null = null;

    static async getInstance(progress_callback: ProgressCallback | null = null): Promise<Pipeline> {
        if (this.instance === null) {
            try {
                // @ts-expect-error - External module import for Deno Edge Function
                const transformers = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/transformers.min.js') as TransformersModule;
                
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

interface PersonalizedSearchRequest {
  query: string;
  user_id?: string;
  match_threshold?: number;
  match_count?: number;
  include_behavioral?: boolean;
  search_type?: 'semantic' | 'collaborative' | 'hybrid';
  category_filter?: string;
  price_range?: { min: number; max: number };
}

interface PersonalizedSearchResult {
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
  behavioral_score: number;
  popularity_score: number;
  final_score: number;
  interaction_count: number;
  is_purchased: boolean;
  recommendation_reason: string;
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
}

interface TrendingItem {
  note_id: number;
  notes: TrendingNote;
}

interface CollaborativeRecommendation {
  note_id: number;
  title: string;
  author: string;
  category: string;
  price: number;
  rating: number;
  similarity_score: number;
  recommendation_reason: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();

  try {
    const requestBody: PersonalizedSearchRequest = await req.json();
    const {
      query,
      user_id,
      match_threshold = 0.3,
      match_count = 20,
      include_behavioral = true,
      search_type = 'hybrid',
      category_filter,
      price_range
    } = requestBody;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required and must be a non-empty string' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') || '' }
        }
      }
    );

    let queryEmbedding: number[] = [];
    let searchResults: PersonalizedSearchResult[] = [];
    let collaborativeRecommendations: CollaborativeRecommendation[] = [];

    // Generate embedding for semantic search
    if (search_type === 'semantic' || search_type === 'hybrid') {
      try {
        const extractor = await PipelineSingleton.getInstance();
        const output = await extractor(query, {
          pooling: 'mean',
          normalize: true,
        });
        queryEmbedding = Array.from(output.data);
      } catch (embeddingError) {
        console.warn('Embedding generation failed, falling back to text search:', embeddingError);
      }
    }

    // Get personalized search results
    if (search_type === 'semantic' || search_type === 'hybrid') {
      const { data: personalizedResults, error } = await supabaseClient.rpc('get_personalized_search_results', {
        p_user_id: user_id || null,
        p_query_embedding: queryEmbedding,
        p_search_query: query,
        p_match_threshold: match_threshold,
        p_match_count: Math.max(match_count - 5, 10), // Leave room for collaborative recommendations
        p_include_behavioral: include_behavioral && !!user_id
      });

      if (error) {
        console.error('Personalized search error:', error);
        throw error;
      }

      searchResults = (personalizedResults as PersonalizedSearchResult[]) || [];
    }

    // Get collaborative filtering recommendations for logged-in users
    if ((search_type === 'collaborative' || search_type === 'hybrid') && user_id) {
      const { data: collabResults, error: collabError } = await supabaseClient.rpc('get_collaborative_recommendations', {
        p_user_id: user_id,
        p_recommendation_count: 5
      });

      if (!collabError && collabResults) {
        collaborativeRecommendations = collabResults as CollaborativeRecommendation[];
      }
    }

    // Track search behavior
    if (user_id) {
      try {
        await supabaseClient
          .from('user_behavior')
          .insert({
            user_id: user_id,
            action_type: 'search',
            search_query: query,
            metadata: {
              search_type,
              match_threshold,
              results_count: searchResults.length,
              has_collaborative: collaborativeRecommendations.length > 0
            }
          });
      } catch (analyticsError) {
        console.warn('Failed to track search behavior:', analyticsError);
      }
    }

    // Apply additional filters
    let filteredResults = searchResults;

    if (category_filter && category_filter !== 'All') {
      filteredResults = filteredResults.filter(result => result.category === category_filter);
    }

    if (price_range) {
      filteredResults = filteredResults.filter(result => 
        result.price >= price_range.min && result.price <= price_range.max
      );
    }

    // Get user preferences for response metadata
    let userPreferences = null;
    if (user_id) {
      const { data: prefs } = await supabaseClient
        .from('user_preferences')
        .select('*')
        .eq('user_id', user_id)
        .single();
      userPreferences = prefs;
    }

    // Fallback for anonymous users or poor results
    let fallbackResults: PersonalizedSearchResult[] = [];
    if (filteredResults.length < 3 && !user_id) {
      const { data: trending, error: trendingError } = await supabaseClient
        .from('note_popularity_metrics')
        .select(`
          note_id,
          notes!inner(id, title, body, tags, category, author, price, rating, review_count, created_at)
        `)
        .order('trending_score', { ascending: false })
        .limit(5);

      if (!trendingError && trending) {
        fallbackResults = trending.map((item: TrendingItem) => ({
          ...item.notes,
          semantic_score: 0,
          behavioral_score: 0,
          popularity_score: 1.0,
          final_score: 0.8,
          interaction_count: 0,
          is_purchased: false,
          recommendation_reason: 'Trending content'
        }));
      }
    }

    const executionTime = Date.now() - startTime;

    // Prepare comprehensive response
    const response = {
      query,
      search_type,
      user_id: user_id || null,
      execution_time_ms: executionTime,
      personalized_results: {
        semantic_results: filteredResults,
        collaborative_recommendations: collaborativeRecommendations,
        fallback_results: fallbackResults,
        total_results: filteredResults.length + collaborativeRecommendations.length + fallbackResults.length
      },
      personalization_metadata: {
        is_personalized: !!user_id && include_behavioral,
        has_user_preferences: !!userPreferences,
        user_preferences: userPreferences ? {
          preferred_categories: userPreferences.preferred_categories,
          preferred_tags: userPreferences.preferred_tags,
          followed_creators_count: userPreferences.followed_creators?.length || 0
        } : null,
        behavioral_factors_used: user_id && include_behavioral ? [
          'interaction_history',
          'category_preferences', 
          'creator_following',
          'tag_preferences'
        ] : [],
        scoring_weights: {
          semantic: search_type === 'semantic' ? 1.0 : 0.5,
          behavioral: user_id && include_behavioral ? 0.3 : 0.0,
          popularity: 0.2
        }
      },
      search_suggestions: {
        recommended_categories: userPreferences?.preferred_categories || [],
        trending_tags: [], // Could be populated from trending analysis
        similar_queries: [] // Could be populated from user search history
      },
      performance_tips: generatePersonalizedTips(filteredResults, collaborativeRecommendations, user_id, executionTime)
    };

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Personalized search function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({
        error: 'Personalized search failed',
        details: errorMessage,
        fallback_suggestion: 'Try a simpler search query or browse trending content'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

// Helper function to generate personalized tips
function generatePersonalizedTips(
  searchResults: PersonalizedSearchResult[], 
  collaborativeResults: CollaborativeRecommendation[], 
  userId?: string, 
  executionTime?: number
): string[] {
  const tips: string[] = [];

  if (!userId) {
    tips.push('Log in to get personalized search results based on your preferences');
    tips.push('Create an account to receive recommendations from similar users');
  } else {
    if (searchResults.length === 0) {
      tips.push('Try broader search terms or explore trending content');
      tips.push('Update your preferences to get better personalized results');
    }

    if (collaborativeResults.length > 0) {
      tips.push('Check out recommendations based on users with similar tastes');
    }

    if (searchResults.some(r => r.behavioral_score > 0.7)) {
      tips.push('These results match your previous interests');
    }

    if (executionTime && executionTime > 500) {
      tips.push('Consider more specific search terms for faster results');
    }
  }

  return tips;
}
