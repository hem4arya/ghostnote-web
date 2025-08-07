import { getSupabaseClient } from '../../lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/shared/ui/components/dialog';
import { useState, useEffect } from 'react';
import PrivateAccountSetup from './navbar/components/PrivateAccountSetup';
import { Github, Chrome } from 'lucide-react';
import { Button } from '@/components/shared/ui/components/button';
import { Input } from '@/components/shared/ui/components/input';
import { Label } from '@/components/shared/ui/components/label';
import { Eye } from 'lucide-react';

interface AuthFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view?: 'sign_in' | 'sign_up';
  onOpenPrivateAccount?: () => void;
}

export default function AuthForm({ open, onOpenChange, view: initialView = 'sign_in', onOpenPrivateAccount }: AuthFormProps) {
  const supabase = getSupabaseClient();
  const [showPrivateSetup, setShowPrivateSetup] = useState(false);
  const [view, setView] = useState(initialView);

  useEffect(() => {
    setView(initialView);
  }, [initialView, open]);

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    });
  };

  useEffect(() => {
    console.log("AuthForm useEffect triggered. open:", open);
    if (open) {
      document.body.style.overflow = 'hidden';
      const navbar = document.querySelector('.navbar-container') as HTMLElement;
      if (navbar) {
        navbar.style.display = 'none';
        console.log("Navbar hidden.");
      }
    } else {
      document.body.style.overflow = 'unset';
      const navbar = document.querySelector('.navbar-container') as HTMLElement;
      if (navbar) {
        navbar.style.display = '';
        console.log("Navbar displayed.");
      }
    }

    return () => {
      console.log("AuthForm useEffect cleanup.");
      document.body.style.overflow = 'unset';
      const navbar = document.querySelector('.navbar-container') as HTMLElement;
      if (navbar) {
        navbar.style.display = '';
        console.log("Navbar reset during cleanup.");
      }
    };
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-card to-card/90 border-primary/20 w-full max-w-screen-sm mx-auto p-6">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {view === 'sign_in' ? 'Welcome Back' : 'Create an Account'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              {view === 'sign_in' ? 'Sign in to continue to Ghost-Note.' : 'Join the community and start sharing your notes.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="bg-muted/30 border-border/50 text-foreground"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pr-10 bg-input/50 border-border/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                >
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* Social Login */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-4 py-2">
              <button
                onClick={() => handleOAuthLogin('github')}
                className="p-2 rounded-full bg-primary hover:bg-primary/80 transition"
                aria-label="Continue with Github"
              >
                <Github className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={() => handleOAuthLogin('google')}
                className="p-2 rounded-full bg-primary hover:bg-primary/80 transition"
                aria-label="Continue with Google"
              >
                <Chrome className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={() => setShowPrivateSetup(true)}
                className="p-2 rounded-full bg-primary hover:bg-primary/80 transition"
                aria-label="Continue with Private Account"
              >
                <Eye className="h-6 w-6 text-white" />
              </button>
            </div>

            {/* Private Account Button */}
            {onOpenPrivateAccount && (
              <Button
                onClick={onOpenPrivateAccount}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-lg py-6 font-medium"
              >
                Create Private Account
              </Button>
            )}
          </div>

          <div className="text-center mt-2">
            <button
              onClick={() => setView(view === 'sign_in' ? 'sign_up' : 'sign_in')}
              className="text-sm text-muted-foreground/80 hover:text-muted-foreground transition-colors"
            >
              {view === 'sign_in' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <PrivateAccountSetup 
        open={showPrivateSetup} 
        onOpenChange={setShowPrivateSetup} 
      />
    </>
  );
}
