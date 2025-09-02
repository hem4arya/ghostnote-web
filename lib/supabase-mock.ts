// Mock Supabase client for local development
export const mockSupabaseClient = {
  auth: {
    getUser: async () => ({ 
      data: { user: null }, 
      error: null 
    }),
    signUp: async () => ({ 
      data: { user: null, session: null }, 
      error: { message: 'Mock mode - Supabase not configured' } 
    }),
    signInWithPassword: async () => ({ 
      data: { user: null, session: null }, 
      error: { message: 'Mock mode - Supabase not configured' } 
    }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ 
      data: { subscription: { unsubscribe: () => {} } } 
    })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ 
          data: null, 
          error: { message: 'Mock mode - Supabase not configured' } 
        })
      })
    }),
    insert: () => ({ 
      error: { message: 'Mock mode - Supabase not configured' } 
    }),
    update: () => ({
      eq: () => ({ 
        error: { message: 'Mock mode - Supabase not configured' } 
      })
    })
  }),
  rpc: async () => ({ 
    data: null, 
    error: { message: 'Mock mode - Supabase not configured' } 
  }),
  storage: {
    from: () => ({
      upload: async () => ({ 
        data: null, 
        error: { message: 'Mock mode - Supabase not configured' } 
      }),
      getPublicUrl: () => ({ 
        data: { publicUrl: 'https://via.placeholder.com/150' } 
      })
    })
  }
};