import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium theme-transition focus-ring disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-accent-light dark:bg-accent-dark text-white hover:opacity-90 focus:ring-accent-light dark:focus:ring-accent-dark": variant === 'default',
            "bg-error-600 text-white hover:bg-error-700 focus:ring-error-500": variant === 'destructive',
            "border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark text-foreground-light dark:text-foreground-dark hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-accent-light dark:focus:ring-accent-dark": variant === 'outline',
            "bg-gray-100 dark:bg-gray-800 text-foreground-light dark:text-foreground-dark hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-accent-light dark:focus:ring-accent-dark": variant === 'secondary',
            "text-foreground-light dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-accent-light dark:focus:ring-accent-dark": variant === 'ghost',
            "text-accent-light dark:text-accent-dark underline-offset-4 hover:underline focus:ring-accent-light dark:focus:ring-accent-dark": variant === 'link',
          },
          {
            "h-10 px-4 py-2 min-w-[2.5rem]": size === 'default',
            "h-9 rounded-md px-3 text-xs min-w-[2rem]": size === 'sm',
            "h-11 rounded-md px-8 text-base min-w-[3rem]": size === 'lg',
            "h-10 w-10 p-0": size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
