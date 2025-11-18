import { motion } from 'framer-motion'
import ContactsTable from '@/components/organisms/ContactsTable'

export default function Contacts() {
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
            Contacts
          </h1>
          <p className="text-surface-600 text-lg">
            Manage your contacts and track their journey through your sales pipeline.
          </p>
        </motion.div>

        {/* Contacts Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ContactsTable />
        </motion.section>
      </div>
    </div>
  )
}