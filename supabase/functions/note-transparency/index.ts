import { createClient } from '@supabase/supabase-js';
import { corsHeaders } from '../_shared/cors';

interface TransparencyRequest {
  note_id: number;
  user_id?: string; // Optional for public viewing
}

interface TransparencyResponse {
  note_id: number;
  is_clone: boolean;
  originality_score: number; // 0-100, where 100 is completely original
  originality_level: 'Original' | 'Modified' | 'Heavily Inspired' | 'Clone';
  similarity_score?: number; // Only present if is_clone is true
  original_note?: {
    id: number;
    title: string;
    creator_id: string;
    creator_username?: string;
    creator_is_public: boolean;
    created_at: string;
  };
  transparency_badge: {
    text: string;
    severity: 'none' | 'low' | 'medium' | 'high';
    show_source_link: boolean;
  };
  buyer_message: {
    title: string;
    description: string;
    recommendation: string;
  };
}

type SupabaseClientType = ReturnType<typeof createClient>;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { note_id, user_id }: TransparencyRequest = await req.json();

    if (!note_id) {
      return new Response(
        JSON.stringify({ error: 'note_id is required' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Create a Supabase client
    const authHeader = req.headers.get('Authorization');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      authHeader ? { global: { headers: { Authorization: authHeader } } } : {}
    );

    const transparencyData = await getTransparencyData(supabaseClient as SupabaseClientType, note_id, user_id);

    return new Response(
      JSON.stringify(transparencyData), {
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

async function getTransparencyData(
  supabaseClient: SupabaseClientType, 
  noteId: number, 
  userId?: string
): Promise<TransparencyResponse> {
  // Check if this note is flagged as a clone
  const { data: cloneData, error: cloneError } = await supabaseClient.rpc(
    'get_note_transparency_info',
    {
      p_note_id: noteId,
      p_requesting_user_id: userId || null
    }
  );

  if (cloneError) throw cloneError;

  const cloneInfo = (cloneData as unknown[])[0] as {
    is_clone: boolean;
    similarity_score: number;
    original_note_id: number;
    original_note_title: string;
    original_creator_id: string;
    original_creator_username: string;
    original_creator_is_public: boolean;
    original_created_at: string;
  } | null;

  if (!cloneInfo || !cloneInfo.is_clone) {
    // This is an original note
    return {
      note_id: noteId,
      is_clone: false,
      originality_score: 100,
      originality_level: 'Original',
      transparency_badge: {
        text: 'Original Content',
        severity: 'none',
        show_source_link: false
      },
      buyer_message: {
        title: 'Original Content',
        description: 'This note contains original content created by the author.',
        recommendation: 'You\'re purchasing authentic, original work.'
      }
    };
  }

  // This is a clone - calculate originality and create appropriate response
  const similarityScore = cloneInfo.similarity_score;
  const originalityScore = Math.max(0, 100 - similarityScore);
  const originalityLevel = getOriginalityLevel(similarityScore);
  const badge = generateTransparencyBadge(similarityScore);
  const message = generateBuyerMessage(originalityLevel, similarityScore, cloneInfo.original_creator_username);

  return {
    note_id: noteId,
    is_clone: true,
    originality_score: originalityScore,
    originality_level: originalityLevel,
    similarity_score: similarityScore,
    original_note: {
      id: cloneInfo.original_note_id,
      title: cloneInfo.original_note_title,
      creator_id: cloneInfo.original_creator_id,
      creator_username: cloneInfo.original_creator_is_public ? cloneInfo.original_creator_username : undefined,
      creator_is_public: cloneInfo.original_creator_is_public,
      created_at: cloneInfo.original_created_at
    },
    transparency_badge: badge,
    buyer_message: message
  };
}

function getOriginalityLevel(similarityScore: number): 'Original' | 'Modified' | 'Heavily Inspired' | 'Clone' {
  if (similarityScore >= 90) return 'Clone';
  if (similarityScore >= 70) return 'Heavily Inspired';
  if (similarityScore >= 50) return 'Modified';
  return 'Original';
}

function generateTransparencyBadge(
  similarityScore: number
): { text: string; severity: 'none' | 'low' | 'medium' | 'high'; show_source_link: boolean } {
  if (similarityScore >= 90) {
    return {
      text: `${Math.round(similarityScore)}% Match – View Source`,
      severity: 'high',
      show_source_link: true
    };
  }
  
  if (similarityScore >= 70) {
    return {
      text: `${Math.round(similarityScore)}% Similar – Inspired By`,
      severity: 'medium',
      show_source_link: true
    };
  }
  
  if (similarityScore >= 50) {
    return {
      text: `Modified Content – ${Math.round(100 - similarityScore)}% Original`,
      severity: 'low',
      show_source_link: true
    };
  }

  return {
    text: 'Original Content',
    severity: 'none',
    show_source_link: false
  };
}

function generateBuyerMessage(
  originalityLevel: string,
  similarityScore: number,
  originalCreator?: string
): { title: string; description: string; recommendation: string } {
  const creatorText = originalCreator ? ` by ${originalCreator}` : '';
  
  switch (originalityLevel) {
    case 'Clone':
      return {
        title: 'Near-Identical Content',
        description: `This note is ${Math.round(similarityScore)}% similar to existing content${creatorText}. It may contain minimal modifications or additions.`,
        recommendation: 'Consider checking the original source before purchasing. This content may be available elsewhere.'
      };
      
    case 'Heavily Inspired':
      return {
        title: 'Heavily Inspired Content',
        description: `This note draws significantly from existing content${creatorText}, with ${Math.round(100 - similarityScore)}% original additions or modifications.`,
        recommendation: 'This may offer a different perspective or additional insights on familiar material.'
      };
      
    case 'Modified':
      return {
        title: 'Modified Content',
        description: `This note builds upon existing content${creatorText} with substantial modifications and ${Math.round(100 - similarityScore)}% original material.`,
        recommendation: 'This appears to offer meaningful additions or a fresh take on the source material.'
      };
      
    default:
      return {
        title: 'Original Content',
        description: 'This note contains original content created by the author.',
        recommendation: 'You\'re purchasing authentic, original work.'
      };
  }
}
