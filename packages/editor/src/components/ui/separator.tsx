import * as React from "react";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className = "", orientation = "horizontal", ...props }, ref) => {
    const orientationClasses =
      orientation === "vertical" ? "w-px h-full" : "h-px w-full";

    return React.createElement("div", {
      className: `bg-gray-200 ${orientationClasses} ${className}`,
      ref,
      ...props,
    });
  }
);
Separator.displayName = "Separator";
