import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors';

interface CloneDetectionRequest {
  source_note_id: number;
  suspect_note_id: number;
  similarity_score: number;
}

interface CloneDetectionResponse {
  clone_id: number;
  status: string;
  requires_alert: boolean;
  source_user_id: string;
  suspect_user_id: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { source_note_id, suspect_note_id, similarity_score }: CloneDetectionRequest = await req.json();

    if (!source_note_id || !suspect_note_id || similarity_score === undefined) {
      return new Response(
        JSON.stringify({ 
          error: 'source_note_id, suspect_note_id, and similarity_score are required' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create a Supabase client
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Process the clone detection
    const { data, error } = await supabaseClient.rpc('process_clone_detection', {
      p_source_note_id: source_note_id,
      p_suspect_note_id: suspect_note_id,
      p_similarity_score: similarity_score,
    });

    if (error) {
      throw error;
    }

    // If no data returned, it means the score was below threshold or same user
    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ 
          message: 'No clone relationship created (below threshold or same user)',
          processed: false 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const result: CloneDetectionResponse = data[0];

    // If an alert is required, you could trigger notifications here
    if (result.requires_alert) {
      // TODO: Implement notification system
      // This could send an email, push notification, or create an in-app notification
      console.log(`Alert required: Clone detected between notes ${source_note_id} and ${suspect_note_id}`);
    }

    return new Response(
      JSON.stringify({
        processed: true,
        clone_id: result.clone_id,
        status: result.status,
        requires_alert: result.requires_alert,
        message: getStatusMessage(result.status),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (e) {
    const error = e as Error;
    return new Response(
      JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

function getStatusMessage(status: string): string {
  switch (status) {
    case 'CLONE':
      return 'Auto-flagged as clone (90%+ similarity)';
    case 'POTENTIAL_COPY':
      return 'Marked as potential copy (70-89% similarity)';
    case 'SIMILAR':
      return 'Logged as similar content (50-69% similarity)';
    default:
      return 'Processed';
  }
}
