/**
 * Form Validation Hook
 * Custom hook for real-time form validation
 */

import { useState, useCallback, useMemo } from 'react';
import { AuthFormData, AuthMode, AuthValidation } from '../types/auth';
import { validateEmail, validatePassword, validatePasswordMatch, validateForm } from '../utils/validation';

export const useFormValidation = (mode: AuthMode) => {
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    confirmPassword: mode === 'sign_up' ? '' : undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Real-time validation
  const validation = useMemo<AuthValidation>(() => {
    const emailValid = validateEmail(formData.email).isValid;
    const passwordValid = validatePassword(formData.password).isValid;
    const passwordsMatch = mode === 'sign_up' && formData.confirmPassword !== undefined
      ? validatePasswordMatch(formData.password, formData.confirmPassword).isValid
      : undefined;

    return {
      emailValid,
      passwordValid,
      passwordsMatch
    };
  }, [formData, mode]);

  // Update form data
  const updateFormData = useCallback((field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Mark field as touched
  const markFieldTouched = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  // Validate specific field
  const validateField = useCallback((field: keyof AuthFormData) => {
    let fieldValidation;
    
    switch (field) {
      case 'email':
        fieldValidation = validateEmail(formData.email);
        break;
      case 'password':
        fieldValidation = validatePassword(formData.password);
        break;
      case 'confirmPassword':
        if (mode === 'sign_up' && formData.confirmPassword !== undefined) {
          fieldValidation = validatePasswordMatch(formData.password, formData.confirmPassword);
        }
        break;
    }
    
    if (fieldValidation && !fieldValidation.isValid) {
      setErrors(prev => ({ ...prev, [field]: fieldValidation.error! }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [formData, mode]);

  // Validate entire form
  const validateFormData = useCallback(() => {
    const result = validateForm(formData, mode);
    setErrors(result.errors);
    return result.isValid;
  }, [formData, mode]);

  // Clear form data
  const clearForm = useCallback(() => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: mode === 'sign_up' ? '' : undefined
    });
    setErrors({});
    setTouched({});
  }, [mode]);

  // Get field error (only show if touched)
  const getFieldError = useCallback((field: string) => {
    return touched[field] ? errors[field] : undefined;
  }, [errors, touched]);

  return {
    formData,
    validation,
    errors,
    touched,
    updateFormData,
    markFieldTouched,
    validateField,
    validateFormData,
    clearForm,
    getFieldError,
    isFormValid: Object.keys(errors).length === 0 && validation.emailValid && validation.passwordValid && (mode === 'sign_in' || validation.passwordsMatch === true)
  };
};