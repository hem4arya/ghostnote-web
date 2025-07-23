/**
 * Authentication Modal Component - Theme-aware modal for login/signup
 * Features glassmorphism design and comprehensive auth options
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, UserCheck, Eye, EyeOff, Copy, AlertTriangle } from 'lucide-react';
import { Button } from '@shared/ui/components/button';
import { Input } from '@shared/ui/components/input';
import { Label } from '@shared/ui/components/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@shared/ui/components/tooltip';
import type { AuthModalProps, AuthMode, AuthFormData } from '@/components/homepage/types';
import '@/components/homepage/styles/auth-modal.css';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    alias: '',
    phone: ''
  });
  
  // For private account
  const generateUsername = () => {
    const prefixes = ["ghost", "phantom", "shadow", "cipher", "void", "echo"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${randomPrefix}_${randomSuffix}`;
  };
  
  const [generatedUsername] = useState(generateUsername());
  const [privatePassword, setPrivatePassword] = useState("");
  const [confirmPrivatePassword, setConfirmPrivatePassword] = useState("");

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { mode, formData });
  };

  const handleSocialLogin = (provider: 'google' | 'phone' | 'private') => {
    console.log('Social login:', provider);
    if (provider === 'private') {
      setMode('private');
    }
  };

  const copyUsername = () => {
    navigator.clipboard.writeText(generatedUsername);
    // Add toast notification if needed
  };

  const handleCreatePrivateAccount = () => {
    if (!privatePassword) {
      console.error("Password required");
      return;
    }

    if (privatePassword !== confirmPrivatePassword) {
      console.error("Passwords don't match");
      return;
    }

    if (privatePassword.length < 8) {
      console.error("Password too short");
      return;
    }

    console.log("Private account created successfully");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="auth-modal-container">
        {/* Backdrop */}
        <div 
          className="auth-modal-backdrop"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="auth-modal-wrapper">
          <div className="auth-modal">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="auth-modal-close"
            >
              <X className="auth-modal-close-icon" />
            </button>

            {/* Header */}
            <div className="auth-modal-header">
              <h2 className="auth-modal-title">
                Welcome to GhostNote
              </h2>
              <p className="auth-modal-subtitle">
                {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
              </p>
            </div>

            {/* Tabs */}
            <div className="auth-modal-tabs-container">
              <div className="auth-modal-tabs">
                <button
                  onClick={() => setMode('login')}
                  className={`auth-modal-tab ${mode === 'login' ? 'auth-modal-tab-active' : ''}`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`auth-modal-tab ${mode === 'signup' ? 'auth-modal-tab-active' : ''}`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setMode('private')}
                  className={`auth-modal-tab ${mode === 'private' ? 'auth-modal-tab-active' : ''}`}
                >
                  Private
                </button>
              </div>
            </div>

            {/* Form */}
            {mode !== 'private' ? (
              <form onSubmit={handleSubmit} className="auth-modal-form">
                {/* Email */}
                <div className="auth-modal-field">
                  <Mail className="auth-modal-field-icon" />
                  <Input
                    type="email"
                    placeholder={mode === 'login' ? 'Email or Username' : 'Email'}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="auth-modal-input"
                  />
                </div>

                {/* Username (Signup only) */}
                {mode === 'signup' && (
                  <div className="auth-modal-field">
                    <User className="auth-modal-field-icon" />
                    <Input
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="auth-modal-input"
                    />
                  </div>
                )}

                {/* Password */}
                <div className="auth-modal-field">
                  <Lock className="auth-modal-field-icon" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="auth-modal-input auth-modal-input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-modal-password-toggle"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Confirm Password (Signup only) */}
                {mode === 'signup' && (
                  <div className="auth-modal-field">
                    <Lock className="auth-modal-field-icon" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="auth-modal-input auth-modal-input-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="auth-modal-password-toggle"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="auth-modal-submit"
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
            ) : (
              /* Private Account Form */
              <div className="auth-modal-private-form">
                {/* Generated Username */}
                <div className="auth-modal-private-field">
                  <Label className="auth-modal-private-label">
                    Your Anonymous Identity
                  </Label>
                  <div className="auth-modal-private-username">
                    <Input
                      value={generatedUsername}
                      readOnly
                      className="auth-modal-private-input"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyUsername}
                      className="auth-modal-copy-btn"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Password */}
                <div className="auth-modal-private-field">
                  <Label className="auth-modal-private-label">
                    Vault Password
                  </Label>
                  <div className="auth-modal-field">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={privatePassword}
                      onChange={(e) => setPrivatePassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="auth-modal-private-input auth-modal-input-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="auth-modal-password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="auth-modal-private-field">
                  <Label className="auth-modal-private-label">
                    Confirm Password
                  </Label>
                  <div className="auth-modal-field">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPrivatePassword}
                      onChange={(e) => setConfirmPrivatePassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="auth-modal-private-input auth-modal-input-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="auth-modal-password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Warning Box */}
                <div className="auth-modal-warning">
                  <div className="auth-modal-warning-content">
                    <AlertTriangle className="auth-modal-warning-icon" />
                    <div className="auth-modal-warning-text">
                      <p className="auth-modal-warning-title">
                        This is a private account
                      </p>
                      <p className="auth-modal-warning-desc">
                        If you forget your password, your account and notes will be permanently deleted after 60 days of inactivity. No recovery options available.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Create Account Button */}
                <Button
                  onClick={handleCreatePrivateAccount}
                  className="auth-modal-submit auth-modal-private-submit"
                >
                  Create Private Account
                </Button>
              </div>
            )}

            {/* Divider */}
            <div className="auth-modal-divider">
              <div className="auth-modal-divider-line" />
              <span className="auth-modal-divider-text">Or</span>
            </div>

            {/* Social Login Options */}
            <TooltipProvider>
              <div className="auth-modal-social">
                {/* Google */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleSocialLogin('google')}
                      className="auth-modal-social-btn"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Continue with Google</p>
                  </TooltipContent>
                </Tooltip>

                {/* Phone */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleSocialLogin('phone')}
                      className="auth-modal-social-btn"
                    >
                      <Phone className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Continue with Phone (OTP)</p>
                  </TooltipContent>
                </Tooltip>

                {/* Private Account */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setMode('private')}
                      className={`auth-modal-social-btn ${
                        mode === 'private' ? 'auth-modal-social-btn-active' : ''
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Private Account (Anonymous)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {/* Footer */}
            <div className="auth-modal-footer">
              {mode === 'login' ? (
                <p>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="auth-modal-link"
                  >
                    Sign up
                  </button>
                </p>
              ) : mode === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="auth-modal-link"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p>
                  Want a regular account instead?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="auth-modal-link"
                  >
                    Sign up
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
