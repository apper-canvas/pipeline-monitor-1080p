import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-surface-50 via-white to-primary-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md space-y-8"
      >
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
          className="relative"
        >
          <div className="text-8xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-primary-600 bg-clip-text text-transparent">
            404
          </div>
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute -top-4 -right-8 w-16 h-16 bg-gradient-to-br from-accent-400 to-primary-500 rounded-full flex items-center justify-center"
          >
            <ApperIcon name="Search" className="w-8 h-8 text-white" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold text-surface-900">
            Page Not Found
          </h1>
          <p className="text-surface-600 leading-relaxed">
            Looks like this page got lost in the pipeline! The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4"
        >
          <Button
            onClick={() => navigate('/')}
            icon="Home"
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate('/contacts')}
            icon="Users"
            className="w-full sm:w-auto"
          >
            View Contacts
          </Button>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="pt-8 border-t border-surface-200"
        >
          <p className="text-sm text-surface-600 mb-4">Quick links to get you back on track:</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/pipeline')}
              className="flex items-center space-x-2 p-3 rounded-lg border border-surface-200 hover:border-primary-300 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 transition-all duration-200 text-sm"
            >
              <ApperIcon name="GitBranch" className="w-4 h-4 text-primary-600" />
              <span>Pipeline</span>
            </button>
            
            <button
              onClick={() => navigate('/activities')}
              className="flex items-center space-x-2 p-3 rounded-lg border border-surface-200 hover:border-accent-300 hover:bg-gradient-to-r hover:from-accent-50 hover:to-primary-50 transition-all duration-200 text-sm"
            >
              <ApperIcon name="Clock" className="w-4 h-4 text-accent-600" />
              <span>Activities</span>
            </button>
          </div>
        </motion.div>

        {/* Floating elements for visual interest */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-20 left-10 w-4 h-4 bg-gradient-to-br from-primary-300 to-accent-300 rounded-full"
        />
        
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            x: [0, 10, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
          className="absolute bottom-20 right-10 w-6 h-6 bg-gradient-to-br from-accent-300 to-primary-300 rounded-full"
        />
      </motion.div>
    </div>
  )
}