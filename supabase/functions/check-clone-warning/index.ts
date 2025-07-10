import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors';

interface CloneWarningRequest {
  user_id: string;
  note_content: string;
  note_title: string;
}

interface CloneWarningResponse {
  warning_level: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  similar_note_id?: number;
  similar_note_title?: string;
  original_user_id?: string;
  similarity_score?: number;
  message: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { user_id, note_content, note_title }: CloneWarningRequest = await req.json();

    if (!user_id || !note_content || !note_title) {
      return new Response(
        JSON.stringify({ 
          error: 'user_id, note_content, and note_title are required' 
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

    // Check for potential clone warning
    const { data, error } = await supabaseClient.rpc('check_potential_clone_warning', {
      p_user_id: user_id,
      p_note_content: note_content,
      p_note_title: note_title,
    });

    if (error) {
      throw error;
    }

    // Process the result
    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({
          warning_level: 'NONE',
          message: 'No similar content detected',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    const result = data[0];
    const response: CloneWarningResponse = {
      warning_level: result.warning_level,
      message: getWarningMessage(result.warning_level, result.similarity_score),
    };

    // Include details about the similar note if found
    if (result.warning_level !== 'NONE' && result.similar_note_id) {
      response.similar_note_id = result.similar_note_id;
      response.similar_note_title = result.similar_note_title;
      response.original_user_id = result.original_user_id;
      response.similarity_score = result.similarity_score;
    }

    return new Response(
      JSON.stringify(response), {
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

function getWarningMessage(warningLevel: string, score?: number): string {
  switch (warningLevel) {
    case 'HIGH':
      return `Warning: This content appears to be very similar (${score}%) to an existing note. This may be flagged as a clone.`;
    case 'MEDIUM':
      return `Caution: This content is similar (${score}%) to an existing note. The original creator will be notified.`;
    case 'LOW':
      return `Notice: This content has some similarity (${score}%) to existing content.`;
    case 'NONE':
    default:
      return 'No similar content detected';
  }
}
