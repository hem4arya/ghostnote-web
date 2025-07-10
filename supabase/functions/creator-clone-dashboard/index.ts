import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors';

interface CreatorDashboardRequest {
  action: 'get_dashboard' | 'get_stats' | 'handle_action' | 'send_message' | 'get_history';
  creator_user_id: string;
  clone_id?: number;
  action_type?: string;
  message?: string;
  resale_decision?: boolean;
  message_subject?: string;
  message_body?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const requestData: CreatorDashboardRequest = await req.json();
    const { action, creator_user_id } = requestData;

    if (!creator_user_id) {
      return new Response(
        JSON.stringify({ error: 'creator_user_id is required' }), {
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

    let result;
    const statusCode = 200;

    switch (action) {
      case 'get_dashboard':
        result = await getDashboardData(supabaseClient as SupabaseClientType, creator_user_id);
        break;

      case 'get_stats':
        result = await getCreatorStats(supabaseClient as SupabaseClientType, creator_user_id);
        break;

      case 'handle_action':
        if (!requestData.clone_id || !requestData.action_type) {
          return new Response(
            JSON.stringify({ error: 'clone_id and action_type are required for handle_action' }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }
        result = await handleCreatorAction(
          supabaseClient as SupabaseClientType,
          requestData.clone_id,
          creator_user_id,
          requestData.action_type,
          requestData.message,
          requestData.resale_decision
        );
        break;

      case 'send_message':
        if (!requestData.clone_id || !requestData.message_subject || !requestData.message_body) {
          return new Response(
            JSON.stringify({ error: 'clone_id, message_subject, and message_body are required for send_message' }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }
        result = await sendMessageToCloner(
          supabaseClient as SupabaseClientType,
          requestData.clone_id,
          creator_user_id,
          requestData.message_subject,
          requestData.message_body
        );
        break;

      case 'get_history':
        if (!requestData.clone_id) {
          return new Response(
            JSON.stringify({ error: 'clone_id is required for get_history' }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 400,
            }
          );
        }
        result = await getCloneActionHistory(supabaseClient as SupabaseClientType, requestData.clone_id);
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action specified' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
    }

    return new Response(
      JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: statusCode,
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

type SupabaseClientType = ReturnType<typeof createClient>;

async function getDashboardData(supabaseClient: SupabaseClientType, creatorUserId: string) {
  const { data, error } = await supabaseClient.rpc('get_creator_clone_dashboard', {
    p_creator_user_id: creatorUserId,
  });

  if (error) throw error;

  // Group clones by original note
  interface CloneRow {
    original_note_id: number;
    original_note_title: string;
    original_note_created_at: string;
    clone_id: number;
    clone_note_id: number;
    clone_note_title: string;
    clone_note_created_at: string;
    cloner_user_id: string;
    cloner_username: string;
    cloner_is_anonymous: boolean;
    similarity_score: number;
    clone_status: string;
    creator_action: string;
    resale_allowed: boolean;
    clone_detected_at: string;
    last_action_at: string;
  }

  interface GroupedNote {
    original_note: {
      id: number;
      title: string;
      created_at: string;
    };
    clones: Array<{
      clone_id: number;
      note: {
        id: number;
        title: string;
        created_at: string;
      };
      cloner: {
        user_id: string;
        username: string;
        is_anonymous: boolean;
      };
      similarity_score: number;
      status: string;
      creator_action: string;
      resale_allowed: boolean;
      detected_at: string;
      last_action_at: string;
    }>;
  }
  
  const groupedData = (data as CloneRow[]).reduce((acc: Record<number, GroupedNote>, row: CloneRow) => {
    const noteId = row.original_note_id;
    
    if (!acc[noteId]) {
      acc[noteId] = {
        original_note: {
          id: row.original_note_id,
          title: row.original_note_title,
          created_at: row.original_note_created_at,
        },
        clones: [],
      };
    }

    acc[noteId].clones.push({
      clone_id: row.clone_id,
      note: {
        id: row.clone_note_id,
        title: row.clone_note_title,
        created_at: row.clone_note_created_at,
      },
      cloner: {
        user_id: row.cloner_user_id,
        username: row.cloner_username,
        is_anonymous: row.cloner_is_anonymous,
      },
      similarity_score: row.similarity_score,
      status: row.clone_status,
      creator_action: row.creator_action,
      resale_allowed: row.resale_allowed,
      detected_at: row.clone_detected_at,
      last_action_at: row.last_action_at,
    });

    return acc;
  }, {});

  return {
    success: true,
    data: Object.values(groupedData),
  };
}

async function getCreatorStats(supabaseClient: SupabaseClientType, creatorUserId: string) {
  const { data, error } = await supabaseClient.rpc('get_creator_clone_stats', {
    p_creator_user_id: creatorUserId,
  });

  if (error) throw error;

  return {
    success: true,
    stats: (data as unknown[])[0],
  };
}

async function handleCreatorAction(
  supabaseClient: SupabaseClientType,
  cloneId: number,
  creatorUserId: string,
  actionType: string,
  message?: string,
  resaleDecision?: boolean
) {
  const { data, error } = await supabaseClient.rpc('handle_creator_clone_action', {
    p_clone_id: cloneId,
    p_creator_user_id: creatorUserId,
    p_action_type: actionType,
    p_message: message || null,
    p_resale_decision: resaleDecision ?? null,
  });

  if (error) throw error;

  const result = (data as unknown[])[0] as { success: boolean; message: string; action_id: string };
  return {
    success: result.success,
    message: result.message,
    action_id: result.action_id,
  };
}

async function sendMessageToCloner(
  supabaseClient: SupabaseClientType,
  cloneId: number,
  creatorUserId: string,
  messageSubject: string,
  messageBody: string
) {
  const { data, error } = await supabaseClient.rpc('send_message_to_cloner', {
    p_clone_id: cloneId,
    p_creator_user_id: creatorUserId,
    p_message_subject: messageSubject,
    p_message_body: messageBody,
  });

  if (error) throw error;

  const result = (data as unknown[])[0] as { success: boolean; message: string; cloner_user_id: string };
  return {
    success: result.success,
    message: result.message,
    cloner_user_id: result.cloner_user_id,
  };
}

async function getCloneActionHistory(supabaseClient: SupabaseClientType, cloneId: number) {
  const { data, error } = await supabaseClient.rpc('get_clone_action_history', {
    p_clone_id: cloneId,
  });

  if (error) throw error;

  return {
    success: true,
    history: data,
  };
}
