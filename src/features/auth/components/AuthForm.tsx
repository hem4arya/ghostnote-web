import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from 'react';
import PrivateAccountSetup from './PrivateAccountSetup';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AuthForm({ open, onOpenChange }: AuthModalProps) {
  const supabase = createClientComponentClient()
  const [showPrivateSetup, setShowPrivateSetup] = useState(false);

  const handlePrivateAccountClick = () => {
    onOpenChange(false); // Close the auth modal
    setShowPrivateSetup(true); // Open the private account setup modal
  };


  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-gradient-to-br from-card to-card/90 border-primary/20">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Connect Your Account
            </DialogTitle>
            <p className="text-muted-foreground mt-2">
              Join the community and start sharing your notes.
            </p>
          </DialogHeader>
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            appearance={{ theme: ThemeSupa }}
            theme="dark"
            showLinks={false}
            providers={['github', 'google']}
            redirectTo="http://localhost:3000/auth/callback"
          />
          <div className="text-center mt-4">
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
