import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

export default function ErrorView({ 
  error = "Something went wrong", 
  onRetry,
  className = "",
  variant = "page"
}) {
  if (variant === "card") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`card p-6 text-center ${className}`}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center mx-auto mb-4">
          <ApperIcon name="AlertCircle" className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-sm font-medium text-surface-900 mb-2">Error Loading Data</h3>
        <p className="text-xs text-surface-600 mb-4">{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-secondary text-xs">
            <ApperIcon name="RefreshCw" className="w-3 h-3 mr-1" />
            Retry
          </button>
        )}
      </motion.div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <ApperIcon name="AlertTriangle" className="w-10 h-10 text-red-600" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-surface-900">
            Oops! Something went wrong
          </h2>
          <p className="text-surface-600 leading-relaxed">
            {error}
          </p>
          <p className="text-sm text-surface-500">
            Don't worry, this happens sometimes. Please try again or contact support if the problem persists.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center space-x-3 mt-8"
        >
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-primary"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}
          <button
            onClick={() => window.location.href = '/'}
            className="btn-secondary"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Go Home
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-xs text-surface-400"
        >
          Error Code: {Date.now().toString().slice(-6)}
        </motion.div>
      </motion.div>
    </div>
  )
}