/**
 * PrivateSignUpForm Component
 * Dedicated form for private account creation with username and password only
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { getSupabaseClient } from '../../../../lib/supabase';

interface PrivateSignUpFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface PrivateFormData {
  username: string;
  password: string;
  confirmPassword: string;
}

interface PrivateFormValidation {
  usernameValid: boolean;
  passwordValid: boolean;
  passwordsMatch: boolean;
}

export const PrivateSignUpForm: React.FC<PrivateSignUpFormProps> = ({
  onSuccess,
  onError,
}) => {
  const [formData, setFormData] = useState<PrivateFormData>({
    username: '',
    password: '',
    confirmPassword: '',
  });
  
  const [validation, setValidation] = useState<PrivateFormValidation>({
    usernameValid: false,
    passwordValid: false,
    passwordsMatch: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  
  const supabase = getSupabaseClient();

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username || formData.username.length < 3) {
        setUsernameError('Username must be at least 3 characters');
        setValidation(prev => ({ ...prev, usernameValid: false }));
        return;
      }

      if (formData.username.includes('-') || formData.username.includes(' ')) {
        setUsernameError('Username cannot contain hyphens or spaces');
        setValidation(prev => ({ ...prev, usernameValid: false }));
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', formData.username)
          .single();

        if (error && error.code === 'PGRST116') {
          // Username is available
          setUsernameError(null);
          setValidation(prev => ({ ...prev, usernameValid: true }));
        } else if (data) {
          setUsernameError('Username is already taken');
          setValidation(prev => ({ ...prev, usernameValid: false }));
        }
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameError('Error checking username availability');
        setValidation(prev => ({ ...prev, usernameValid: false }));
      }
    };

    const debounceTimer = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.username, supabase]);

  // Validate passwords
  useEffect(() => {
    const passwordValid = formData.password.length >= 8;
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword !== '';

    setValidation(prev => ({
      ...prev,
      passwordValid,
      passwordsMatch,
    }));
  }, [formData.password, formData.confirmPassword]);

  const handleInputChange = (field: keyof PrivateFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validation.usernameValid || !validation.passwordValid || !validation.passwordsMatch) {
      return;
    }

    setLoading(true);

    try {
      const privateEmail = `${formData.username}@private.ghostnote.io`;

      // Create the user account
      const { error: signUpError } = await supabase.auth.signUp({
        email: privateEmail,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            is_private: true
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw new Error(signUpError.message);
      }

      // Create the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          username: formData.username,
          is_private: true
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Attempt to clean up the auth user if profile creation fails
        await supabase.auth.signOut();
        throw new Error('Failed to create user profile. Please try again.');
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error creating private account:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        error
      });
      onError?.(error instanceof Error ? error.message : 'An error occurred while creating your account');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = validation.usernameValid && validation.passwordValid && validation.passwordsMatch;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Warning Message */}
      <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-sm text-destructive">
          This is a private, password-only account. If you lose your password, your account and notes will be lost forever. There is no password reset.
        </AlertDescription>
      </Alert>

      {/* Username Input */}
      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-foreground">
          Username
        </Label>
        <Input
          id="username"
          type="text"
          value={formData.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
          placeholder="Enter your username"
          className={`bg-muted/30 border text-foreground transition-all duration-300 focus:outline-none focus:ring-0 ${
            usernameError
              ? 'border-destructive hover:border-destructive'
              : validation.usernameValid
              ? 'border-[#00ff41] hover:border-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.2)]'
              : 'border-white/20 hover:border-white/30'
          }`}
          required
        />
        {usernameError ? (
          <p className="text-xs text-destructive mt-1">{usernameError}</p>
        ) : validation.usernameValid ? (
          <p className="text-xs text-[#00ff41] mt-1">Username is available</p>
        ) : null}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Label htmlFor="private-password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <div className="relative">
          <Input
            id="private-password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter your password"
            className={`pr-10 bg-muted/30 border border-white/20 text-foreground transition-all duration-300 focus:outline-none focus:ring-0 focus:border-white/40 hover:border-white/30 ${
              validation.passwordValid && 'shadow-[0_0_8px_rgba(0,255,65,0.2)]'
            }`}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent transition-colors duration-200"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground hover:text-[#00ff41] transition-colors duration-200" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground hover:text-[#00ff41] transition-colors duration-200" />
            )}
          </Button>
        </div>
        {!validation.passwordValid && formData.password && (
          <p className="text-xs text-destructive mt-1">
            Password must be at least 8 characters
          </p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm your password"
            className={`pr-10 bg-muted/30 border border-white/20 text-foreground transition-all duration-300 focus:outline-none focus:ring-0 focus:border-white/40 hover:border-white/30 ${
              validation.passwordsMatch && formData.confirmPassword
                ? 'shadow-[0_0_8px_rgba(0,255,65,0.3)]'
                : ''
            }`}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent transition-colors duration-200"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground hover:text-[#00ff41] transition-colors duration-200" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground hover:text-[#00ff41] transition-colors duration-200" />
            )}
          </Button>
        </div>
        {formData.confirmPassword && !validation.passwordsMatch && (
          <p className="text-xs text-destructive mt-1">Passwords do not match</p>
        )}
        {validation.passwordsMatch && formData.confirmPassword && (
          <p className="text-xs text-[#00ff41] mt-1 flex items-center gap-1">
            <span className="w-1 h-1 bg-[#00ff41] rounded-full animate-pulse"></span>
            Passwords match
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(0,255,65,0.3)] hover:border-[#00ff41] text-white font-medium py-2 transition-all duration-300 border border-transparent"
        disabled={loading || !isFormValid}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Creating Account...
          </>
        ) : (
          "Create Private Account"
        )}
      </Button>
    </form>
  );
};
