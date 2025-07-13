"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  /**
   * The size of the progress bar
   * @default "default"
   */
  size?: "default" | "sm"
  /**
   * Whether to show the progress label
   * @default false
   */
  showValue?: boolean
  /**
   * The format to display the progress value in
   * @default "percent"
   */
  valueFormat?: "percent" | "value"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      size = "default",
      showValue = false,
      valueFormat = "percent",
      ...props
    },
    ref
  ) => {
    const percentage = (value / max) * 100
    const displayValue = valueFormat === "percent" ? `${Math.round(percentage)}%` : `${value}/${max}`

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-ghost-dark/30 border border-ghost-purple/20",
          size === "default" ? "h-2" : "h-1",
          className
        )}
        {...props}
      >
        <div
          className="h-full w-full flex-1 bg-gradient-to-r from-ghost-purple to-ghost-neon transition-all"
          style={{ width: `${percentage}%` }}
        />
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
            {displayValue}
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
