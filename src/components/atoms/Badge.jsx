import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

const Badge = forwardRef(({ 
  className, 
  variant = "default",
  size = "default",
  children,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full"
  
  const variants = {
    default: "bg-surface-100 text-surface-800",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-200/50",
    secondary: "bg-gradient-to-r from-surface-100 to-surface-200 text-surface-700 border border-surface-200/50",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200/50",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200/50",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200/50",
    accent: "bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800 border border-accent-200/50",
    lead: "bg-gradient-to-r from-surface-100 to-surface-200 text-surface-700 border border-surface-300/50",
    qualified: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200/50",
    demo: "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-200/50",
    proposal: "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border border-orange-200/50",
    negotiation: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-200/50",
    won: "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-200/50",
    lost: "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200/50"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    default: "px-2.5 py-0.5 text-xs",
    lg: "px-3 py-1 text-sm"
  }

  return (
    <span
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = "Badge"

export default Badge