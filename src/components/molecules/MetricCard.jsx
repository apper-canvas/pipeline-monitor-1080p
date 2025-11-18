import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

export default function MetricCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  gradient = "from-primary-500 to-primary-600",
  className = "",
  loading = false
}) {
  if (loading) {
    return (
      <div className={cn("metric-card", className)}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-24"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-surface-200 to-surface-300 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gradient-to-r from-surface-200 to-surface-300 rounded mb-2 w-32"></div>
          <div className="h-3 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-20"></div>
        </div>
      </div>
    )
  }

  const changeColors = {
    positive: "text-green-600 bg-green-50 border-green-200",
    negative: "text-red-600 bg-red-50 border-red-200",
    neutral: "text-surface-600 bg-surface-50 border-surface-200"
  }

  const changeIcons = {
    positive: "TrendingUp",
    negative: "TrendingDown",
    neutral: "Minus"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn("metric-card group", className)}
    >
      {/* Gradient accent bar */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b rounded-l-lg", gradient)}></div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-surface-600 text-sm font-medium group-hover:text-surface-700 transition-colors">
          {title}
        </h3>
        {icon && (
          <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", gradient)}>
            <ApperIcon name={icon} className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="text-3xl font-bold text-surface-900 group-hover:text-surface-950 transition-colors">
          {value}
        </div>
        
        {change !== undefined && (
          <div className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors",
            changeColors[changeType]
          )}>
            <ApperIcon name={changeIcons[changeType]} className="w-3 h-3 mr-1" />
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </motion.div>
  )
}