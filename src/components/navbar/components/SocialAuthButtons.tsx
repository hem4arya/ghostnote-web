/**
 * SocialAuthButtons Component
 * Social authentication options with improved iconography
 */

import React from "react";
import { Github, Shield } from "lucide-react";
import { getSupabaseClient } from "../../../../lib/supabase";

interface SocialAuthButtonsProps {
  onPrivateAccountClick?: () => void;
  onError?: (error: string) => void;
}

// Custom Google Icon Component (replacing Chrome icon)
const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onPrivateAccountClick,
  onError,
}) => {
  const supabase = getSupabaseClient();

  const handleOAuthLogin = async (provider: "github" | "google") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${
            typeof window !== "undefined" ? window.location.origin : ""
          }/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (error: unknown) {
      const errorMessage =
error instanceof Error ? error.message : `An error occurred during ${provider} authentication`;
      onError?.(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Separator */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-primary/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Auth Buttons */}
      <div className="flex justify-center gap-4 py-2">
        {/* GitHub Button */}
        <button
          onClick={() => handleOAuthLogin("github")}
          className="group p-3 rounded-full bg-primary hover:bg-primary/90 hover:shadow-[0_0_12px_rgba(0,255,65,0.3)] hover:border-[#00ff41] transition-all duration-300 border border-transparent"
          aria-label="Continue with GitHub"
        >
          <Github className="h-6 w-6 text-white group-hover:text-[#00ff41] transition-colors duration-200" />
        </button>

        {/* Google Button */}
        <button
          onClick={() => handleOAuthLogin("google")}
          className="group p-3 rounded-full bg-primary hover:bg-primary/90 hover:shadow-[0_0_12px_rgba(0,255,65,0.3)] hover:border-[#00ff41] transition-all duration-300 border border-transparent"
          aria-label="Continue with Google"
        >
          <GoogleIcon className="h-6 w-6 text-white group-hover:text-[#00ff41] transition-colors duration-200" />
        </button>

        {/* Private Account Button */}
        {onPrivateAccountClick && (
          <button
            onClick={onPrivateAccountClick}
            className="group p-3 rounded-full bg-primary hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(0,255,65,0.4)] hover:border-[#00ff41] transition-all duration-300 border border-transparent"
            aria-label="Create Private Account"
          >
            <Shield className="h-6 w-6 text-white group-hover:text-[#00ff41] transition-colors duration-200" />
          </button>
        )}
      </div>

      {/* Button Labels */}
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span className="text-center w-12">GitHub</span>
        <span className="text-center w-12">Google</span>
        {onPrivateAccountClick && (
          <span className="text-center w-12">Private</span>
        )}
      </div>
    </div>
  );
};
