import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { formatDistanceToNow, format } from 'date-fns'
import ActivityIcon from '@/components/molecules/ActivityIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import activityService from '@/services/api/activityService'
import contactService from '@/services/api/contactService'
import dealService from '@/services/api/dealService'

export default function ActivitiesTimeline() {
  const [activities, setActivities] = useState([])
  const [contacts, setContacts] = useState({})
  const [deals, setDeals] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    type: "",
    dateRange: "",
    contact: ""
  })

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ])
      
      const contactsMap = contactsData.reduce((acc, contact) => {
        acc[contact.Id] = contact
        return acc
      }, {})

      const dealsMap = dealsData.reduce((acc, deal) => {
        acc[deal.Id] = deal
        return acc
      }, {})
      
      setActivities(activitiesData)
      setContacts(contactsMap)
      setDeals(dealsMap)
    } catch (err) {
      setError(err.message || "Failed to load activities")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Filter and search logic
  const filteredActivities = useMemo(() => {
    let filtered = [...activities]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(activity => {
        const contact = contacts[activity.contactId]
        const deal = deals[activity.dealId]
        return (
          activity.description.toLowerCase().includes(query) ||
          activity.outcome?.toLowerCase().includes(query) ||
          contact?.companyName?.toLowerCase().includes(query) ||
          contact?.contactPerson?.toLowerCase().includes(query) ||
          deal?.title?.toLowerCase().includes(query)
        )
      })
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(activity => activity.type === filters.type)
    }

    // Date range filter
    if (filters.dateRange) {
      const now = new Date()
      let cutoffDate
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          cutoffDate = null
      }
      
      if (cutoffDate) {
        filtered = filtered.filter(activity => new Date(activity.timestamp) >= cutoffDate)
      }
    }

    // Contact filter
    if (filters.contact) {
      filtered = filtered.filter(activity => activity.contactId === parseInt(filters.contact))
    }

    return filtered
  }, [activities, searchQuery, filters, contacts, deals])

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups = {}
    
    filteredActivities.forEach(activity => {
      const date = format(new Date(activity.timestamp), 'yyyy-MM-dd')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
    })
    
    return Object.entries(groups)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([date, activities]) => ({
        date,
        activities: activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      }))
  }, [filteredActivities])

  // Filter options
  const activityTypes = [...new Set(activities.map(a => a.type))]
  const uniqueContacts = [...new Set(activities.map(a => a.contactId))]
    .map(id => contacts[id])
    .filter(Boolean)

  const filterOptions = [
    {
      key: "type",
      label: "Activity Type",
      value: filters.type,
      options: activityTypes.map(type => ({
        value: type,
        label: type
      }))
    },
    {
      key: "dateRange",
      label: "Date Range", 
      value: filters.dateRange,
      options: [
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" }
      ]
    },
    {
      key: "contact",
      label: "Contact",
      value: filters.contact,
      options: uniqueContacts.map(contact => ({
        value: contact.Id.toString(),
        label: contact.companyName
      }))
    }
  ]

  if (loading) {
    return <Loading variant="table" />
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadData} />
  }

  if (activities.length === 0) {
    return (
      <Empty
        title="No activities found"
        description="Activities will appear here as you interact with contacts and deals"
        icon="Clock"
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <SearchBar
        placeholder="Search activities by description, outcome, contact, or deal..."
        value={searchQuery}
        onSearch={setSearchQuery}
        showFilters={true}
        filters={filterOptions}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-600">
          Showing {filteredActivities.length} of {activities.length} activities
        </p>
      </div>

      {/* Activities Timeline */}
      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities match your search"
          description="Try adjusting your search terms or filters"
          icon="Search"
          variant="card"
        />
      ) : (
        <div className="space-y-8">
          {groupedActivities.map(({ date, activities: dayActivities }) => (
            <div key={date} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-semibold text-surface-900">
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-surface-300 to-transparent"></div>
                <Badge variant="secondary" size="sm">
                  {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}
                </Badge>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-surface-200 to-transparent"></div>
                
                <div className="space-y-6">
                  {dayActivities.map((activity, index) => {
                    const contact = contacts[activity.contactId]
                    const deal = activity.dealId ? deals[activity.dealId] : null
                    
                    return (
                      <motion.div
                        key={activity.Id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="relative flex items-start space-x-4"
                      >
                        {/* Timeline dot */}
                        <div className="relative z-10 flex-shrink-0">
                          <ActivityIcon type={activity.type} />
                        </div>

                        {/* Activity content */}
                        <div className="flex-1 min-w-0 pb-6">
                          <div className="card p-6 hover:shadow-card-hover transition-shadow duration-200">
                            <div className="space-y-4">
                              {/* Header */}
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-surface-900 mb-1">
                                    {activity.description}
                                  </h4>
                                  <div className="flex items-center space-x-2 text-sm text-surface-600">
                                    <span>{contact?.companyName || 'Unknown Contact'}</span>
                                    {deal && (
                                      <>
                                        <span>•</span>
                                        <span>{deal.title}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  <Badge variant="secondary" size="sm">
                                    {activity.type}
                                  </Badge>
                                  <span className="text-xs text-surface-500">
                                    {format(new Date(activity.timestamp), 'h:mm a')}
                                  </span>
                                </div>
                              </div>

                              {/* Outcome */}
                              {activity.outcome && (
                                <div className="bg-gradient-to-r from-surface-50 to-primary-50 rounded-lg p-4 border border-surface-200/50">
                                  <p className="text-sm text-surface-700">
                                    <strong>Outcome:</strong> {activity.outcome}
                                  </p>
                                </div>
                              )}

                              {/* Contact info */}
                              <div className="flex items-center justify-between text-xs text-surface-500">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-primary-600">
                                      {contact?.contactPerson?.charAt(0) || '?'}
                                    </span>
                                  </div>
                                  <span>{contact?.contactPerson}</span>
                                </div>
                                <span>
                                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}