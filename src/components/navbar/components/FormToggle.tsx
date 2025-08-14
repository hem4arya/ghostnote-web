/**
 * FormToggle Component
 * Navigation between sign-in and sign-up modes
 */

import React from 'react';
import { AuthMode } from '../types/auth';

interface FormToggleProps {
  currentMode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  className?: string;
}

export const FormToggle: React.FC<FormToggleProps> = ({ 
  currentMode, 
  onModeChange, 
  className = "" 
}) => {
  const handleSignInToggle = () => {
    onModeChange('sign_in');
  };

  const handleSignUpToggle = () => {
    onModeChange('sign_up');
  };

  const getToggleText = () => {
    if (currentMode === 'private_account') {
      return null; // Private account has its own toggle buttons
    }
    return currentMode === 'sign_in' 
      ? "Don't have an account? Sign up"
      : "Already have an account? Sign in";
  };

  const handleToggle = () => {
    if (currentMode === 'private_account') return;
    const newMode = currentMode === 'sign_in' ? 'sign_up' : 'sign_in';
    onModeChange(newMode);
  };

  if (currentMode === 'private_account') {
    return (
      <div className={`text-center mt-6 space-y-2 ${className}`}>
        <p className="text-xs text-muted-foreground mb-3">Already have an account?</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={handleSignInToggle}
            className="text-sm text-muted-foreground/80 hover:text-[#00ff41] transition-colors duration-300 hover:underline focus:outline-none focus:underline decoration-[#00ff41] hover:shadow-[0_0_8px_rgba(0,255,65,0.2)] px-3 py-1"
          >
            Sign In
          </button>
          <span className="text-muted-foreground/50">|</span>
          <button
            type="button"
            onClick={handleSignUpToggle}
            className="text-sm text-muted-foreground/80 hover:text-[#00ff41] transition-colors duration-300 hover:underline focus:outline-none focus:underline decoration-[#00ff41] hover:shadow-[0_0_8px_rgba(0,255,65,0.2)] px-3 py-1"
          >
            Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center mt-6 ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        className="text-sm text-muted-foreground/80 hover:text-[#00ff41] transition-colors duration-300 hover:underline focus:outline-none focus:underline decoration-[#00ff41] hover:shadow-[0_0_8px_rgba(0,255,65,0.2)]"
      >
        {getToggleText()}
      </button>
    </div>
  );
};