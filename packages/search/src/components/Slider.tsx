import * as React from "react";

export interface SliderProps {
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (value: number[]) => void;
  max?: number;
  min?: number;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, min = 0, max = 100, step = 1, value, defaultValue, onValueChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || defaultValue || [min]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [parseInt(e.target.value)];
      setInternalValue(newValue);
      onValueChange?.(newValue);
    };

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={internalValue[0]}
        onChange={handleChange}
        className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${className || ''}`}
        {...props}
      />
    );
  }
);

Slider.displayName = "Slider";
