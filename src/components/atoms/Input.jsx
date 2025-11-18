import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Input = forwardRef(({ 
  className, 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "w-full px-3 py-2 border rounded-lg shadow-sm transition-colors duration-200 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-offset-0",
        error 
          ? "border-red-300 focus:border-red-500 focus:ring-red-500" 
          : "border-surface-300 focus:border-primary-500 focus:ring-primary-500",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input