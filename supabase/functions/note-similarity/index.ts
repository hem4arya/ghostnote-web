import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors';

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { note_id1, note_id2 } = await req.json();

    if (!note_id1 || !note_id2) {
      return new Response(JSON.stringify({ error: 'note_id1 and note_id2 are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create a Supabase client with the user's auth token
    const authHeader = req.headers.get('Authorization')!;
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data, error } = await supabaseClient.rpc('calculate_similarity_score', {
      note_id1,
      note_id2,
    });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify({ similarity_score: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (e) {
    const error = e as Error;
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
