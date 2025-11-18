import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import ActivityIcon from '@/components/molecules/ActivityIcon'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import activityService from '@/services/api/activityService'
import contactService from '@/services/api/contactService'

export default function RecentActivities({ limit = 8 }) {
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [activitiesData, contactsData] = await Promise.all([
        activityService.getRecentActivities(limit),
        contactService.getAll()
      ])
      
      const contactsMap = contactsData.reduce((acc, contact) => {
        acc[contact.Id] = contact
        return acc
      }, {})
      
      setActivities(activitiesData)
      setContacts(contactsMap)
    } catch (err) {
      setError(err.message || "Failed to load recent activities")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [limit])

  if (loading) {
    return (
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-surface-900">Recent Activities</h3>
        </div>
        <div className="space-y-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-surface-200 to-surface-300 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-surface-900">Recent Activities</h3>
        </div>
        <ErrorView error={error} onRetry={loadData} variant="card" />
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-surface-900">Recent Activities</h3>
        </div>
        <Empty 
          title="No activities yet"
          description="Activities will appear here as you interact with contacts and deals"
          icon="Clock"
          variant="card"
        />
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-900">Recent Activities</h3>
        <button className="btn-ghost text-sm">
          <ApperIcon name="ExternalLink" className="w-4 h-4 mr-2" />
          View All
        </button>
      </div>

      <div className="space-y-4 custom-scrollbar max-h-96 overflow-y-auto">
        {activities.map((activity, index) => {
          const contact = contacts[activity.contactId]
          
          return (
            <motion.div
              key={activity.Id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-surface-50 hover:to-primary-50 transition-all duration-200 group"
            >
              <ActivityIcon type={activity.type} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-surface-900 group-hover:text-primary-900 transition-colors">
                      {activity.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-surface-600">
                        {contact?.companyName || 'Unknown Contact'}
                      </span>
                      <span className="text-surface-400">•</span>
                      <span className="text-xs text-surface-500">
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    {activity.outcome && (
                      <p className="text-xs text-surface-500 mt-1 line-clamp-2">
                        {activity.outcome}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}