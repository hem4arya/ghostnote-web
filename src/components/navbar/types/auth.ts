/**
 * Authentication Form Types
 * Type definitions for authentication forms and validation
 */

export type AuthMode = 'sign_in' | 'sign_up' | 'private_account';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string; // Only for sign-up
}

export interface AuthValidation {
  emailValid: boolean;
  passwordValid: boolean;
  passwordsMatch?: boolean; // Only for sign-up
}

export interface AuthState {
  mode: AuthMode;
  formData: AuthFormData;
  validation: AuthValidation;
  showPassword: boolean;
  showConfirmPassword?: boolean; // Only for sign-up
  loading: boolean;
  errors: Record<string, string>;
}

export interface ValidationRules {
  email: {
    required: boolean;
    pattern: RegExp;
    message: string;
  };
  password: {
    required: boolean;
    minLength: number;
    message: string;
  };
  confirmPassword: {
    required: boolean; // Only for sign-up
    mustMatch: string;
    message: string;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    [key: string]: unknown;
  };
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}

export interface AuthFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view?: AuthMode;
  onOpenPrivateAccount?: () => void;
}

// PrivateAccountSetupProps removed - using PrivateAccountForm with AuthDialog instead