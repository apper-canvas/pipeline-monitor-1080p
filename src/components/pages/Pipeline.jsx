import { motion } from 'framer-motion'
import PipelineBoard from '@/components/organisms/PipelineBoard'

export default function Pipeline() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-surface-900 via-primary-800 to-primary-900 bg-clip-text text-transparent">
            Sales Pipeline
          </h1>
          <p className="text-surface-600 text-lg">
            Track your deals through every stage of the sales process with drag-and-drop simplicity.
          </p>
        </motion.div>

        {/* Pipeline Board */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PipelineBoard />
        </motion.section>
      </div>
    </div>
  )
}