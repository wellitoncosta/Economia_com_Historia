import * as React from "react"
import { cn } from "@/lib/utils"

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline'
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
          {
            'bg-surface-container-high text-on-surface': variant === 'default',
            'bg-primary-container text-on-primary-container': variant === 'primary',
            'bg-secondary-container text-on-secondary-container': variant === 'secondary',
            'border border-outline text-on-surface': variant === 'outline',
          },
          className
        )}
        {...props}
      />
    )
  }
)
Chip.displayName = "Chip"

export { Chip }
