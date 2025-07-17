"use client";

import * as React from "react";
import { cn } from "../../utils/helpers";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "ghost" | "neon";
  inputSize?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const inputVariants = {
  variant: {
    default:
      "border-ghost-purple/30 bg-ghost-gray/50 text-white placeholder:text-gray-400 focus:bg-ghost-gray/80 focus:border-ghost-purple/60 focus:shadow-lg focus:shadow-ghost-purple/20",
    ghost:
      "border-transparent bg-transparent text-white placeholder:text-gray-500 focus:bg-ghost-gray/20 focus:border-ghost-purple/40",
    neon: "border-ghost-neon/50 bg-ghost-dark/60 text-white placeholder:text-gray-400 focus:bg-ghost-dark/80 focus:border-ghost-neon focus:shadow-lg focus:shadow-ghost-neon/20",
  },
  size: {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  },
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant = "default",
      inputSize = "md",
      icon,
      iconPosition = "left",
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClass = inputVariants.variant[variant];
    const sizeClass = inputVariants.size[inputSize];
    const hasIcon = icon || loading;
    const isDisabled = disabled || loading;

    return (
      <div className="relative">
        {hasIcon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              icon
            )}
          </div>
        )}

        <input
          type={type}
          className={cn(
            "flex w-full rounded-lg border backdrop-blur-sm transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple focus-visible:ring-offset-2 focus-visible:ring-offset-ghost-dark disabled:cursor-not-allowed disabled:opacity-50",
            variantClass,
            sizeClass,
            hasIcon && iconPosition === "left" ? "pl-10" : "",
            hasIcon && iconPosition === "right" ? "pr-10" : "",
            className
          )}
          ref={ref}
          disabled={isDisabled}
          {...props}
        />

        {hasIcon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              icon
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export default Input;
