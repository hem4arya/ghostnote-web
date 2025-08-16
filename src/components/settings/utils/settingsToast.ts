/**
 * Settings Toast Utilities
 * Centralized toast notifications for settings actions
 */

import { toast } from 'sonner';

export const settingsToast = {
  /**
   * Show email update success toast
   */
  emailUpdateSuccess: () => {
    toast.success('Verification email sent', {
      description: 'Please check your inbox to confirm your new email address'
    });
  },

  /**
   * Show email update error toast
   */
  emailUpdateError: (error: string) => {
    toast.error('Failed to update email', {
      description: error
    });
  },

  /**
   * Show profile update success toast
   */
  profileUpdateSuccess: () => {
    toast.success('Profile updated successfully');
  },

  /**
   * Show profile update error toast
   */
  profileUpdateError: (error: string) => {
    toast.error('Failed to update profile', {
      description: error
    });
  },

  /**
   * Show validation error toast
   */
  validationError: (message: string) => {
    toast.error('Validation Error', {
      description: message
    });
  }
};
