/**
 * AuthForm Component
 * Main authentication dialog that switches between sign-in and sign-up modes
 */

import React, { useState, useEffect } from 'react';
import { AuthDialog } from './AuthDialog';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { PrivateAccountForm } from './PrivateAccountForm';
import { SocialAuthButtons } from './SocialAuthButtons';
import { FormToggle } from './FormToggle';
import { AuthFormProps, AuthMode } from '../types/auth';

export default function AuthForm({ 
  open, 
  onOpenChange, 
  view: initialView = 'sign_in', 
  onOpenPrivateAccount 
}: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialView);
  const [error, setError] = useState<string>('');

  // Update mode when initialView changes
  useEffect(() => {
    setMode(initialView);
  }, [initialView, open]);

  // Clear error when dialog opens
  useEffect(() => {
    if (open) {
      setError('');
    }
  }, [open]);

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setError(''); // Clear any existing errors when switching modes
  };

  const handleAuthSuccess = () => {
    onOpenChange(false);
    setError('');
  };

  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handlePrivateAccountClick = () => {
    if (onOpenPrivateAccount) {
      onOpenPrivateAccount();
    } else {
      setMode('private_account');
    }
  };

  const getDialogTitle = () => {
    switch (mode) {
      case 'sign_in':
        return 'Welcome Back';
      case 'sign_up':
        return 'Create an Account';
      case 'private_account':
        return 'Create Private Account';
      default:
        return 'Welcome Back';
    }
  };

  const getDialogDescription = () => {
    switch (mode) {
      case 'sign_in':
        return 'Sign in to continue to Ghost-Note.';
      case 'sign_up':
        return 'Join the community and start sharing your notes.';
      case 'private_account':
        return 'Create a secure, private account with enhanced privacy features.';
      default:
        return 'Sign in to continue to Ghost-Note.';
    }
  };

  return (
    <>
      <AuthDialog
        open={open}
        onOpenChange={onOpenChange}
        title={getDialogTitle()}
        description={getDialogDescription()}
        className="p-6"
      >
        <div className="space-y-6">
          {/* Global Error Message */}
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Form Content */}
          {mode === 'sign_in' ? (
            <SignInForm 
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          ) : mode === 'sign_up' ? (
            <SignUpForm 
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          ) : (
            <PrivateAccountForm 
              onSuccess={handleAuthSuccess}
              onError={handleAuthError}
            />
          )}

          {/* Social Authentication Buttons - Only show for sign_in and sign_up */}
          {mode !== 'private_account' && (
            <SocialAuthButtons 
              onPrivateAccountClick={handlePrivateAccountClick}
              onError={handleAuthError}
            />
          )}

          {/* Form Toggle */}
          <FormToggle 
            currentMode={mode}
            onModeChange={handleModeChange}
          />
        </div>
      </AuthDialog>

    </>
  );
}