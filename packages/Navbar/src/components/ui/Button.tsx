"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/helpers";

const buttonVariants = {
  variant: {
    default:
      "bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-semibold hover:from-ghost-neon hover:to-ghost-cyan focus:outline-none focus:ring-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-ghost-neon/25 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-500",
    destructive:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/25",
    outline:
      "border-2 border-ghost-purple/40 bg-transparent text-white hover:bg-ghost-purple/20 hover:border-ghost-purple/60 hover:text-ghost-neon focus:outline-none focus:ring-0 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm",
    secondary:
      "bg-ghost-gray/60 text-white hover:bg-ghost-gray/80 hover:text-ghost-neon focus:outline-none focus:ring-0 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm",
    ghost:
      "text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus:ring-0 transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm",
    link: "text-ghost-neon underline-offset-4 hover:underline focus:outline-none focus:ring-0 transition-all duration-300 hover:text-ghost-cyan",
    cyber:
      "bg-gradient-to-r from-ghost-cyan to-ghost-neon text-black font-semibold hover:from-ghost-neon hover:to-ghost-purple focus:outline-none focus:ring-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-ghost-cyan/25 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:translate-x-full before:transition-transform before:duration-500",
    neon: "bg-transparent border-2 border-ghost-neon text-ghost-neon hover:bg-ghost-neon hover:text-black focus:outline-none focus:ring-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-ghost-neon/50 relative before:absolute before:inset-0 before:bg-ghost-neon before:opacity-0 hover:before:opacity-10 before:transition-opacity before:duration-300",
  },
  size: {
    default: "h-11 px-6 py-2.5 text-sm font-medium",
    sm: "h-9 px-4 py-2 text-sm",
    lg: "h-12 px-8 py-3 text-base",
    icon: "h-10 w-10 p-0",
    xl: "h-14 px-10 py-4 text-lg font-semibold",
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      loading = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Build the className based on variants
    const variantClass = buttonVariants.variant[variant];
    const sizeClass = buttonVariants.size[size];

    const isDisabled = disabled || loading;

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ghost-purple focus-visible:ring-offset-2 focus-visible:ring-offset-ghost-dark disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed select-none",
          variantClass,
          sizeClass,
          isDisabled && "cursor-not-allowed opacity-60",
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Loading...
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="mr-2 flex items-center">{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className="ml-2 flex items-center">{icon}</span>
            )}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button };
export default Button;
