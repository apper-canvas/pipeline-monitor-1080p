import { forwardRef } from 'react'
import { cn } from '@/utils/cn'
import ApperIcon from '@/components/ApperIcon'

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:ring-primary-500",
    secondary: "bg-white border border-surface-300 hover:border-surface-400 text-surface-700 hover:text-surface-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:ring-primary-500",
    ghost: "text-surface-600 hover:text-surface-900 hover:bg-surface-100 focus:ring-primary-500",
    success: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:ring-green-500",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:ring-red-500",
    accent: "bg-gradient-to-r from-accent-600 to-accent-700 hover:from-accent-700 hover:to-accent-800 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 focus:ring-accent-500"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }

  const iconSize = {
    sm: 14,
    default: 16,
    lg: 18,
    xl: 20
  }

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className={cn("animate-spin", iconPosition === "right" ? "ml-2" : "mr-2")}
          size={iconSize[size]} 
        />
      )}
      {!loading && icon && iconPosition === "left" && (
        <ApperIcon 
          name={icon} 
          className="mr-2" 
          size={iconSize[size]} 
        />
      )}
      {children}
      {!loading && icon && iconPosition === "right" && (
        <ApperIcon 
          name={icon} 
          className="ml-2" 
          size={iconSize[size]} 
        />
      )}
    </button>
  )
})

Button.displayName = "Button"

export default Button