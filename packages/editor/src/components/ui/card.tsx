import * as React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", ...props }, ref) => {
    return React.createElement("div", {
      className: `bg-white border border-gray-200 rounded-lg shadow-sm ${className}`,
      ref,
      ...props,
    });
  }
);
Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = "", ...props }, ref) => {
    return React.createElement("div", {
      className: `p-6 pb-4 ${className}`,
      ref,
      ...props,
    });
  }
);
CardHeader.displayName = "CardHeader";

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = "", ...props }, ref) => {
    return React.createElement("h3", {
      className: `text-lg font-semibold leading-none tracking-tight ${className}`,
      ref,
      ...props,
    });
  }
);
CardTitle.displayName = "CardTitle";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = "", ...props }, ref) => {
    return React.createElement("div", {
      className: `p-6 pt-0 ${className}`,
      ref,
      ...props,
    });
  }
);
CardContent.displayName = "CardContent";
