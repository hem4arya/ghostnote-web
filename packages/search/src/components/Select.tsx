import * as React from "react";

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export const Select = ({ children, ...props }: SelectProps) => {
  return <div className="relative" {...props}>{children}</div>;
};

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  )
);
SelectTrigger.displayName = "SelectTrigger";

export interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, ...props }, ref) => (
    <span ref={ref} className={className} {...props}>
      {placeholder}
    </span>
  )
) as React.ElementType;

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={`absolute top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
) as React.ElementType;

export const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};
