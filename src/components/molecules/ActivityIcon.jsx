import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

export default function ActivityIcon({ type, className = "" }) {
  const configs = {
    Email: {
      icon: "Mail",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-white"
    },
    Call: {
      icon: "Phone",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600", 
      textColor: "text-white"
    },
    Meeting: {
      icon: "Calendar",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-white"
    },
    Note: {
      icon: "FileText",
      bgColor: "bg-gradient-to-br from-orange-500 to-orange-600",
      textColor: "text-white"
    },
    Task: {
      icon: "CheckSquare",
      bgColor: "bg-gradient-to-br from-accent-500 to-accent-600",
      textColor: "text-white"
    }
  }

  const config = configs[type] || configs.Note

  return (
    <div className={cn(
      "activity-icon",
      config.bgColor,
      config.textColor,
      className
    )}>
      <ApperIcon name={config.icon} className="w-4 h-4" />
    </div>
  )
}