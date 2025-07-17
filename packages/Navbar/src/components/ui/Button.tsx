"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../../utils/helpers";

const buttonVariants = {
  variant: {
    default:
      "bg-gradient-to-r from-ghost-purple to-ghost-neon text-black font-medium hover:from-ghost-neon hover:to-ghost-cyan focus:outline-none focus:ring-0",
    destructive:
      "bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-0",
    outline:
      "border border-ghost-purple/30 bg-transparent text-white hover:bg-ghost-purple/20 focus:outline-none focus:ring-0",
    secondary:
      "bg-ghost-gray/50 text-white hover:bg-ghost-gray/80 focus:outline-none focus:ring-0",
    ghost:
      "text-gray-300 hover:text-ghost-neon hover:bg-ghost-purple/20 focus:outline-none focus:ring-0",
    link: "text-ghost-neon underline-offset-4 hover:underline focus:outline-none focus:ring-0",
  },
  size: {
    default: "h-11 px-5 py-2.5",
    sm: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 py-3",
    icon: "h-10 w-10",
  },
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    // Build the className based on variants
    const variantClass = buttonVariants.variant[variant];
    const sizeClass = buttonVariants.size[size];

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClass,
          sizeClass,
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
