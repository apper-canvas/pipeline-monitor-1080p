import { motion } from 'framer-motion'

export default function Loading({ className = "", variant = "page" }) {
  if (variant === "card") {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded mb-4"></div>
          <div className="h-8 bg-gradient-to-r from-surface-200 to-surface-300 rounded mb-3"></div>
          <div className="h-3 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (variant === "table") {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-white rounded-lg border border-surface-100">
            <div className="w-10 h-10 bg-gradient-to-br from-surface-200 to-surface-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-1/4"></div>
              <div className="h-3 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded-full w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "kanban") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded mb-4"></div>
              {[...Array(3)].map((_, j) => (
                <div key={j} className="card p-4 mb-4">
                  <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded mb-2"></div>
                  <div className="h-3 bg-gradient-to-r from-surface-200 to-surface-300 rounded mb-3 w-2/3"></div>
                  <div className="h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded-full w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`}>
      <div className="text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto"
        >
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </motion.div>
        
        <div className="space-y-2">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold text-surface-800"
          >
            Loading Pipeline Pro
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-surface-600"
          >
            Getting your CRM data ready...
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center space-x-1"
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7] 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                delay: i * 0.2 
              }}
              className="w-2 h-2 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full"
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}