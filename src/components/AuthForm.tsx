import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/shared/ui/components/dialog';
import { useState, useEffect } from 'react';
import PrivateAccountSetup from './navbar/components/PrivateAccountSetup';
import { Button } from './shared/ui/components/button';
import { Github, Chrome } from 'lucide-react';

interface AuthFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  view?: 'sign_in' | 'sign_up';
}

export default function AuthForm({ open, onOpenChange, view: initialView = 'sign_in' }: AuthFormProps) {
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    options: {
      global: {
        headers: {
          'Accept': 'application/json'
        }
      }
    }
  });
  const [showPrivateSetup, setShowPrivateSetup] = useState(false);
  const [view, setView] = useState(initialView);

  useEffect(() => {
    setView(initialView);
  }, [initialView, open]);

  const handlePrivateAccountClick = () => {
    onOpenChange(false);
    setShowPrivateSetup(true);
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-card border-primary/20">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {view === 'sign_in' ? 'Welcome Back' : 'Create an Account'}
            </DialogTitle>
            <DialogDescription>
              {view === 'sign_in' ? 'Sign in to continue to Ghost-Note.' : 'Join the community and start sharing your notes.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Button variant="outline" onClick={() => handleOAuthLogin('github')}>
              <Github className="mr-2 h-4 w-4" />
              Continue with Github
            </Button>
            <Button variant="outline" onClick={() => handleOAuthLogin('google')}>
              <Chrome className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          <Auth
            supabaseClient={supabase}
            view={view}
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            showLinks={false}
            providers={[]}
            redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
          />
           <div className="text-center mt-4">
            <button
              onClick={() => setView(view === 'sign_in' ? 'sign_up' : 'sign_in')}
              className="text-sm text-muted-foreground/80 hover:text-muted-foreground transition-colors"
            >
              {view === 'sign_in' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
          <div className="text-center mt-2">
            <button
              onClick={handlePrivateAccountClick}
              className="text-sm text-muted-foreground/80 hover:text-muted-foreground transition-colors"
            >
              Or, continue with a Private Account
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <PrivateAccountSetup 
        open={showPrivateSetup} 
        onOpenChange={setShowPrivateSetup} 
      />
    </>
  )
}
