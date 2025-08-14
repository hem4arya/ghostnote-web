/**
 * Form Validation Utilities
 * Validation functions for authentication forms
 */

import { ValidationRules, AuthFormData } from '../types/auth';

export const validationRules: ValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    minLength: 8,
    message: 'Password must be at least 8 characters long'
  },
  confirmPassword: {
    required: true,
    mustMatch: 'password',
    message: 'Passwords do not match'
  }
};

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!validationRules.email.pattern.test(email)) {
    return { isValid: false, error: validationRules.email.message };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < validationRules.password.minLength) {
    return { isValid: false, error: validationRules.password.message };
  }
  
  return { isValid: true };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: validationRules.confirmPassword.message };
  }
  
  return { isValid: true };
};

export const validateForm = (formData: AuthFormData, mode: 'sign_in' | 'sign_up') => {
  const errors: Record<string, string> = {};
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error!;
  }
  
  // Validate password confirmation for sign-up
  if (mode === 'sign_up' && formData.confirmPassword !== undefined) {
    const confirmPasswordValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
    if (!confirmPasswordValidation.isValid) {
      errors.confirmPassword = confirmPasswordValidation.error!;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const getPasswordStrength = (password: string): { strength: 'weak' | 'medium' | 'strong'; message: string } => {
  if (password.length < 8) {
    return { strength: 'weak', message: 'Password is too short' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (criteriaCount < 2) {
    return { strength: 'weak', message: 'Add uppercase, numbers, or special characters' };
  } else if (criteriaCount < 3) {
    return { strength: 'medium', message: 'Good password strength' };
  } else {
    return { strength: 'strong', message: 'Strong password' };
  }
};