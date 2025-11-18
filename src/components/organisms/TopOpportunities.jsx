import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import dealService from '@/services/api/dealService'
import contactService from '@/services/api/contactService'

export default function TopOpportunities({ limit = 6 }) {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      
      const contactsMap = contactsData.reduce((acc, contact) => {
        acc[contact.Id] = contact
        return acc
      }, {})
      
      // Filter active deals and sort by value
      const activeDeals = dealsData
        .filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage))
        .sort((a, b) => b.value - a.value)
        .slice(0, limit)
      
      setDeals(activeDeals)
      setContacts(contactsMap)
    } catch (err) {
      setError(err.message || "Failed to load top opportunities")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [limit])

  const getStageVariant = (stage) => {
    const variants = {
      'Lead': 'lead',
      'Qualified': 'qualified', 
      'Demo': 'demo',
      'Proposal': 'proposal',
      'Negotiation': 'negotiation'
    }
    return variants[stage] || 'default'
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-surface-900">Top Opportunities</h3>
        </div>
        <div className="space-y-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-3 rounded-lg border border-surface-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-surface-200 to-surface-300 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-32"></div>
                  <div className="h-3 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-24"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="h-4 bg-gradient-to-r from-surface-200 to-surface-300 rounded w-20"></div>
                <div className="h-6 bg-gradient-to-r from-surface-200 to-surface-300 rounded-full w-16"></div>
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
          <h3 className="text-lg font-semibold text-surface-900">Top Opportunities</h3>
        </div>
        <ErrorView error={error} onRetry={loadData} variant="card" />
      </div>
    )
  }

  if (deals.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-surface-900">Top Opportunities</h3>
        </div>
        <Empty 
          title="No opportunities yet"
          description="Your top deals will appear here as you create them"
          icon="Target"
          variant="card"
        />
      </div>
    )
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-surface-900">Top Opportunities</h3>
        <button className="btn-ghost text-sm">
          <ApperIcon name="ExternalLink" className="w-4 h-4 mr-2" />
          View All
        </button>
      </div>

      <div className="space-y-3 custom-scrollbar max-h-96 overflow-y-auto">
        {deals.map((deal, index) => {
          const contact = contacts[deal.contactId]
          
          return (
            <motion.div
              key={deal.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center justify-between p-4 rounded-lg border border-surface-100 hover:border-primary-200 hover:bg-gradient-to-r hover:from-white hover:to-primary-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center group-hover:from-primary-200 group-hover:to-primary-300 transition-colors">
                  <ApperIcon name="Building2" className="w-5 h-5 text-primary-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-surface-900 group-hover:text-primary-900 transition-colors truncate">
                    {deal.title}
                  </h4>
                  <p className="text-sm text-surface-600 truncate">
                    {contact?.companyName || 'Unknown Contact'} • {contact?.contactPerson}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-surface-500">
                      {deal.daysInStage} days in stage
                    </span>
                    <span className="text-surface-400">•</span>
                    <span className="text-xs text-surface-500">
                      {deal.probability}% probability
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right space-y-2 ml-4">
                <div className="font-semibold text-surface-900">
                  {formatCurrency(deal.value)}
                </div>
                <Badge variant={getStageVariant(deal.stage)} size="sm">
                  {deal.stage}
                </Badge>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}