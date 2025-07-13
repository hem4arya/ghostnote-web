'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, UserCheck, Eye, EyeOff, Copy, AlertTriangle } from 'lucide-react';
import { Button } from 'packages/ui-components/components/button';
import { Input } from 'packages/ui-components/components/input';
import { Label } from 'packages/ui-components/components/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'packages/ui-components/components/tooltip';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'signup';
}

const AuthModal = ({ isOpen, onClose, initialMode }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'private'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleInputChange = (field: string, value: string) => {
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

    // Here you would typically call your authentication service
    console.log("Private account created successfully");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={onClose}
        />
        
        {/* Modal Scroll Container */}
        <div className="relative w-full max-w-sm sm:max-w-md my-4 sm:my-8 mx-auto">
          <div className="relative flex flex-col bg-gradient-to-br from-ghost-dark via-ghost-gray to-ghost-dark border border-ghost-purple/30 rounded-xl sm:rounded-2xl shadow-2xl shadow-ghost-purple/20 animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-ghost-purple/20 transition-colors duration-200 z-10 focus:outline-none focus:ring-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
            </button>

            {/* Header */}
            <div className="p-6 sm:p-8 pb-4 sm:pb-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent mb-1 sm:mb-2">
                Welcome to GhostNote
              </h2>
              <p className="text-center text-gray-400 text-sm sm:text-base">
                {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
              </p>
            </div>

            {/* Tabs */}
            <div className="px-6 sm:px-8 pb-4 sm:pb-6">
              <div className="flex bg-ghost-gray/50 rounded-lg p-1">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 py-2 sm:py-2.5 px-4 sm:px-5 rounded-md text-sm sm:text-base font-medium transition-all duration-200 border-0 focus:outline-none focus:ring-0 focus:shadow-none outline-none ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-ghost-purple to-ghost-neon text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 sm:py-2.5 px-4 sm:px-5 rounded-md text-sm sm:text-base font-medium transition-all duration-200 border-0 focus:outline-none focus:ring-0 focus:shadow-none outline-none ${
                    mode === 'signup'
                      ? 'bg-gradient-to-r from-ghost-purple to-ghost-neon text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setMode('private')}
                  className={`flex-1 py-2 sm:py-2.5 px-4 sm:px-5 rounded-md text-sm sm:text-base font-medium transition-all duration-200 border-0 focus:outline-none focus:ring-0 focus:shadow-none outline-none ${
                    mode === 'private'
                      ? 'bg-gradient-to-r from-ghost-purple to-ghost-neon text-black shadow-lg'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Private
                </button>
              </div>
            </div>

            {/* Form */}
            {mode !== 'private' ? (
              <form onSubmit={handleSubmit} className="px-6 sm:px-8 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                {/* Email/Username */}
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-5 sm:h-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder={mode === 'login' ? 'Email or Username' : 'Email'}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 sm:pl-12 h-11 sm:h-12 bg-ghost-gray/50 border border-white/10 text-white placeholder:text-gray-400 focus:border-white/20 focus:bg-ghost-gray/80 focus:outline-none focus:ring-0 text-sm sm:text-base"
                  />
                </div>

                {/* Username (Signup only) */}
                {mode === 'signup' && (
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-5 sm:h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="pl-10 sm:pl-12 h-11 sm:h-12 bg-ghost-gray/50 border border-white/10 text-white placeholder:text-gray-400 focus:border-white/20 focus:bg-ghost-gray/80 focus:outline-none focus:ring-0 text-sm sm:text-base"
                    />
                  </div>
                )}

                {/* Password */}
                <div className="relative">
                  <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-8 sm:pl-10 pr-8 sm:pr-10 h-9 sm:h-10 bg-ghost-gray/50 border border-white/10 text-white placeholder:text-gray-400 focus:border-white/20 focus:bg-ghost-gray/80 focus:outline-none focus:ring-0 text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus:ring-0"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>

                {/* Confirm Password (Signup only) */}
                {mode === 'signup' && (
                  <div className="relative">
                    <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-8 sm:pl-10 h-9 sm:h-10 bg-ghost-gray/50 border border-white/10 text-white placeholder:text-gray-400 focus:border-white/20 focus:bg-ghost-gray/80 focus:outline-none focus:ring-0 text-xs sm:text-sm"
                    />
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-9 sm:h-10 bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-medium hover:from-ghost-neon hover:to-ghost-cyan transition-all duration-300 shadow-lg shadow-ghost-purple/25 focus:outline-none focus:ring-0 text-xs sm:text-sm mt-1"
                >
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Button>
              </form>
            ) : (
              /* Private Account Form */
              <div className="px-6 sm:px-8 pb-4 sm:pb-6 space-y-3 sm:space-y-4">
                {/* Generated Username */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">
                    Your Anonymous Identity
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      value={generatedUsername}
                      readOnly
                      className="bg-ghost-gray/50 border border-white/10 text-white font-mono focus:border-white/20 focus:bg-ghost-gray/80 focus:outline-none focus:ring-0"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyUsername}
                      className="border-ghost-purple/30 bg-ghost-gray/30 hover:bg-ghost-purple/20 hover:border-ghost-purple/60"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">
                    Vault Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={privatePassword}
                      onChange={(e) => setPrivatePassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="pr-10 bg-ghost-gray/50 border border-white/10 text-white placeholder:text-gray-400 focus:border-white/20 focus:bg-ghost-gray/80 focus:outline-none focus:ring-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400"
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-white">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPrivatePassword}
                      onChange={(e) => setConfirmPrivatePassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="pr-10 bg-ghost-gray/50 border border-white/10 text-white placeholder:text-gray-400 focus:border-white/20 focus:bg-ghost-gray/80 focus:outline-none focus:ring-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-gray-400"
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
                <div className="rounded-lg border border-red-400/30 bg-red-500/5 p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-red-400">
                        ⚠️ This is a private account
                      </p>
                      <p className="text-xs text-gray-400">
                        If you forget your password, your account and notes will be permanently deleted after 60 days of inactivity. No recovery options available.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Create Account Button */}
                <Button
                  onClick={handleCreatePrivateAccount}
                  className="w-full h-9 sm:h-10 bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-medium hover:from-ghost-neon hover:to-ghost-cyan transition-all duration-300 shadow-lg shadow-ghost-purple/25 focus:outline-none focus:ring-0 text-xs sm:text-sm mt-4"
                >
                  Create Private Account
                </Button>
              </div>
            )}

            {/* Divider */}
            <div className="px-6 sm:px-8 pb-3 sm:pb-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-ghost-purple/20" />
                </div>
                <div className="relative flex justify-center text-[10px] sm:text-xs uppercase">
                  <span className="bg-ghost-dark px-2 text-gray-400">Or</span>
                </div>
              </div>
            </div>

            {/* Social Login Options */}
            <TooltipProvider>
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex justify-center space-x-3 sm:space-x-4">
                {/* Google */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleSocialLogin('google')}
                      className="border-ghost-purple/30 bg-ghost-gray/30 hover:bg-ghost-purple/20 hover:border-ghost-purple/60 text-white transition-all duration-300 focus:outline-none focus:ring-0 h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
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
                      className="border-ghost-purple/30 bg-ghost-gray/30 hover:bg-ghost-purple/20 hover:border-ghost-purple/60 text-white transition-all duration-300 focus:outline-none focus:ring-0 h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
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
                      className={`border-ghost-purple/30 bg-ghost-gray/30 hover:bg-ghost-purple/20 hover:border-ghost-purple/60 text-white transition-all duration-300 focus:outline-none focus:ring-0 h-8 w-8 sm:h-9 sm:w-9 ${
                        mode === 'private' ? 'border-ghost-neon bg-ghost-purple/40' : ''
                      }`}
                    >
                      <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Private Account (Anonymous)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {/* Footer */}
            <div className="px-6 sm:px-8 pb-5 sm:pb-6 text-center text-[10px] xs:text-xs text-gray-400">
              {mode === 'login' ? (
                <p>
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-ghost-neon hover:text-ghost-cyan transition-colors focus:outline-none focus:ring-0"
                  >
                    Sign up
                  </button>
                </p>
              ) : mode === 'signup' ? (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => setMode('login')}
                    className="text-ghost-neon hover:text-ghost-cyan transition-colors focus:outline-none focus:ring-0"
                  >
                    Sign in
                  </button>
                </p>
              ) : (
                <p>
                  Want a regular account instead?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-ghost-neon hover:text-ghost-cyan transition-colors focus:outline-none focus:ring-0"
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
