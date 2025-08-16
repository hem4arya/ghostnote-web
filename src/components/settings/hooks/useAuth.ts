/**
 * useAuth Hook
 * Manages auth-related operations in settings
 */

'use client';

import { useState } from 'react';
import { getSupabaseClient } from '../../../../lib/supabase';
import { settingsToast } from '../utils/settingsToast';

export const useAuth = () => {
  const [updating, setUpdating] = useState(false);
  const supabase = getSupabaseClient();

  const updateEmail = async (newEmail: string) => {
    try {
      setUpdating(true);
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) throw error;

      settingsToast.emailUpdateSuccess();
    } catch (error) {
      console.error('Error updating email:', error);
      settingsToast.emailUpdateError((error as Error).message);
    } finally {
      setUpdating(false);
    }
  };

  return {
    updating,
    updateEmail
  };
};
