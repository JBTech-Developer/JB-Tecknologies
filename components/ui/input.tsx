import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-sm border border-luxury-beige bg-white px-4 py-3 text-sm text-luxury-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-luxury-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-blue focus-visible:ring-offset-2 focus-visible:border-luxury-blue transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

