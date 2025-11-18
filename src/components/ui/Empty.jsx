import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

export default function Empty({ 
  title = "No data found",
  description = "Get started by adding your first item",
  action,
  actionLabel = "Get Started",
  icon = "Inbox",
  className = "",
  variant = "page"
}) {
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`card p-8 text-center ${className}`}
      >
        <div className="w-16 h-16 bg-gradient-to-br from-surface-100 to-surface-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} className="w-8 h-8 text-surface-400" />
        </div>
        <h3 className="text-sm font-medium text-surface-900 mb-2">{title}</h3>
        <p className="text-xs text-surface-600 mb-4">{description}</p>
        {action && (
          <button onClick={action} className="btn-primary text-xs">
            <ApperIcon name="Plus" className="w-3 h-3 mr-1" />
            {actionLabel}
          </button>
        )}
      </motion.div>
    )
  }

  return (
    <div className={`min-h-96 flex items-center justify-center p-8 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.3 }}
          className="w-24 h-24 bg-gradient-to-br from-surface-100 to-primary-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm"
        >
          <ApperIcon name={icon} className="w-12 h-12 text-surface-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h3 className="text-xl font-semibold text-surface-900">{title}</h3>
          <p className="text-surface-600 leading-relaxed">{description}</p>
        </motion.div>

        {action && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <button
              onClick={action}
              className="btn-primary"
            >
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              {actionLabel}
            </button>
          </motion.div>
        )}

        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          className="mt-8 opacity-30"
        >
          <ApperIcon name="ArrowDown" className="w-5 h-5 text-surface-400 mx-auto" />
        </motion.div>
      </motion.div>
    </div>
  )
}