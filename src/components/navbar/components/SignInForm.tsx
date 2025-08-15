/**
 * SignInForm Component
 * Dedicated sign-in form with email and password fields
 */

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/shared/ui/components/button";
import { Input } from "@/components/shared/ui/components/input";
import { Label } from "@/components/shared/ui/components/label";
import { useFormValidation } from "../hooks/useFormValidation";
import { getSupabaseClient } from "../../../../lib/supabase";

interface SignInFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({
  onSuccess,
  onError,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = getSupabaseClient();

  const {
    formData,
    updateFormData,
    markFieldTouched,
    validateField,
    validateFormData,
    getFieldError,
    isFormValid,
  } = useFormValidation("sign_in");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during sign in";
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailBlur = () => {
    markFieldTouched("email");
    validateField("email");
  };

  const handlePasswordBlur = () => {
    markFieldTouched("password");
    validateField("password");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-2">
        <Label
          htmlFor="signin-email"
          className="text-sm font-medium text-foreground"
        >
          Email Address
        </Label>
        <Input
          id="signin-email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
          onBlur={handleEmailBlur}
          placeholder="Enter your email"
          data-auth-input
          className={`bg-muted/30 border border-white/20 text-foreground transition-all duration-300 focus:outline-none focus:ring-0 focus:border-white/20 hover:border-white/20 hover:shadow-[0_0_8px_rgba(0,255,65,0.2)] ${
            getFieldError("email") ? "" : ""
          }`}
          required
        />
        {getFieldError("email") && (
          <p className="text-xs text-destructive mt-1">
            {getFieldError("email")}
          </p>
        )}
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <Label
          htmlFor="signin-password"
          className="text-sm font-medium text-foreground"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="signin-password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => updateFormData("password", e.target.value)}
            onBlur={handlePasswordBlur}
            placeholder="Enter your password"
            data-auth-input
            className={`pr-10 bg-muted/30 border border-white/20 text-foreground transition-all duration-300 focus:outline-none focus:ring-0 focus:border-white/20 hover:border-white/20 hover:shadow-[0_0_8px_rgba(0,255,65,0.2)] ${
              getFieldError("password") ? "" : ""
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
        {getFieldError("password") && (
          <p className="text-xs text-destructive mt-1">
            {getFieldError("password")}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(0,255,65,0.3)] hover:border-[#00ff41] text-white font-medium py-2 transition-all duration-300 border border-transparent"
        disabled={loading || !isFormValid}
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
};
