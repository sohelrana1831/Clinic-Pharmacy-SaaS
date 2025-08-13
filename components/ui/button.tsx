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
            "bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-600 focus:ring-primary-500": variant === 'default',
            "bg-error-600 text-white hover:bg-error-700 focus:ring-error-500": variant === 'destructive',
            "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-primary-500": variant === 'outline',
            "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-primary-500": variant === 'secondary',
            "text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-primary-500": variant === 'ghost',
            "text-primary-600 dark:text-primary-400 underline-offset-4 hover:underline focus:ring-primary-500": variant === 'link',
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
