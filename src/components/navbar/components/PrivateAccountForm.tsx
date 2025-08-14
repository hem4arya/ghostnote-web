/**
 * PrivateAccountForm Component
 * Dedicated private account form with email, password, and confirm password fields
 */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/shared/ui/components/button';
import { Input } from '@/components/shared/ui/components/input';
import { Label } from '@/components/shared/ui/components/label';
import { useFormValidation } from '../hooks/useFormValidation';
import { getSupabaseClient } from '../../../../lib/supabase';
import { getPasswordStrength } from '../utils/validation';

interface PrivateAccountFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const PrivateAccountForm: React.FC<PrivateAccountFormProps> = ({ onSuccess, onError }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ strength: 'weak' | 'medium' | 'strong'; message: string } | null>(null);
  const supabase = getSupabaseClient();

  const {
    formData,
    validation,
    updateFormData,
    markFieldTouched,
    validateField,
    validateFormData,
    getFieldError,
    isFormValid
  } = useFormValidation('sign_up');

  // Update password strength indicator
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(getPasswordStrength(formData.password));
    } else {
      setPasswordStrength(null);
    }
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormData()) {
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during private account creation';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = () => {
    markFieldTouched('email');
    validateField('email');
  };

  const handlePasswordBlur = () => {
    markFieldTouched('password');
    validateField('password');
  };

  const handleConfirmPasswordBlur = () => {
    markFieldTouched('confirmPassword');
    validateField('confirmPassword');
  };

  // Real-time password matching validation
  const handleConfirmPasswordChange = (value: string) => {
    updateFormData('confirmPassword', value);
    if (value && formData.password) {
      setTimeout(() => validateField('confirmPassword'), 300);
    }
  };

  const getPasswordStrengthColor = () => {
    if (!passwordStrength) return '';
    switch (passwordStrength.strength) {
      case 'weak': return 'text-destructive';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      default: return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Privacy Notice */}
      <div className="p-3 rounded-md bg-primary/5 border border-primary/20 mb-4">
        <p className="text-xs text-muted-foreground">
          <Shield className="h-3 w-3 inline mr-1 text-[#00ff41]" />
          Your private account will be encrypted and anonymous. We do not
          store any personal information beyond what is necessary for
          authentication.
        </p>
      </div>

      {/* Email Input */}
      <div className="space-y-2">
        <Label htmlFor="private-email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        <Input
          id="private-email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData('email', e.target.value)}
          onBlur={handleEmailBlur}
          placeholder="Enter your email"
          data-auth-input
          className={`bg-muted/30 border-primary/30 text-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-0 hover:border-[#00ff41] hover:shadow-[0_0_8px_rgba(0,255,65,0.2)] ${
            getFieldError('email') ? 'border-destructive' : ''
          }`}
          required
        />
        {getFieldError('email') && (
          <p className="text-xs text-destructive mt-1">{getFieldError('email')}</p>
        )}
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
            onChange={(e) => updateFormData('password', e.target.value)}
            onBlur={handlePasswordBlur}
            placeholder="Enter your password"
            data-auth-input
            className={`pr-10 bg-muted/30 border-primary/30 text-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-0 hover:border-[#00ff41] hover:shadow-[0_0_8px_rgba(0,255,65,0.2)] ${
              getFieldError('password') ? 'border-destructive' : ''
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
        {getFieldError('password') && (
          <p className="text-xs text-destructive mt-1">{getFieldError('password')}</p>
        )}
        {passwordStrength && (
          <p className={`text-xs mt-1 ${getPasswordStrengthColor()}`}>
            {passwordStrength.message}
          </p>
        )}
      </div>

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <Label htmlFor="private-confirm-password" className="text-sm font-medium text-foreground">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="private-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword || ''}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
            onBlur={handleConfirmPasswordBlur}
            placeholder="Confirm your password"
            data-auth-input
            className={`pr-10 bg-muted/30 border-primary/30 text-foreground transition-all duration-300 focus:border-primary focus:outline-none focus:ring-0 hover:border-[#00ff41] hover:shadow-[0_0_8px_rgba(0,255,65,0.2)] ${
              getFieldError('confirmPassword') ? 'border-destructive' : 
              validation.passwordsMatch === true ? 'border-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.3)]' : ''
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
        {getFieldError('confirmPassword') && (
          <p className="text-xs text-destructive mt-1">{getFieldError('confirmPassword')}</p>
        )}
        {validation.passwordsMatch === true && formData.confirmPassword && (
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
        {loading ? 'Creating Private Account...' : 'Create Private Account'}
      </Button>
    </form>
  );
};