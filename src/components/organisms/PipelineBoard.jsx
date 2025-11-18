import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import dealService from '@/services/api/dealService'
import contactService from '@/services/api/contactService'
import { toast } from 'react-toastify'

export default function PipelineBoard() {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [draggedDeal, setDraggedDeal] = useState(null)

  const stages = [
    { name: 'Lead', color: 'from-surface-400 to-surface-500' },
    { name: 'Qualified', color: 'from-blue-400 to-blue-500' },
    { name: 'Demo', color: 'from-purple-400 to-purple-500' },
    { name: 'Proposal', color: 'from-orange-400 to-orange-500' },
    { name: 'Negotiation', color: 'from-yellow-400 to-yellow-500' },
    { name: 'Closed Won', color: 'from-green-400 to-green-500' }
  ]

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
      
      setDeals(dealsData)
      setContacts(contactsMap)
    } catch (err) {
      setError(err.message || "Failed to load pipeline")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getDealsByStage = (stageName) => {
    return deals.filter(deal => deal.stage === stageName)
  }

  const getStageValue = (stageName) => {
    const stageDeals = getDealsByStage(stageName)
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0)
  }

  const getStageVariant = (stage) => {
    const variants = {
      'Lead': 'lead',
      'Qualified': 'qualified',
      'Demo': 'demo', 
      'Proposal': 'proposal',
      'Negotiation': 'negotiation',
      'Closed Won': 'won',
      'Closed Lost': 'lost'
    }
    return variants[stage] || 'default'
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetStage) => {
    e.preventDefault()
    
    if (!draggedDeal || draggedDeal.stage === targetStage) {
      setDraggedDeal(null)
      return
    }

    try {
      const updatedDeal = await dealService.updateStage(draggedDeal.Id, targetStage)
      
      setDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.Id === draggedDeal.Id 
            ? updatedDeal
            : deal
        )
      )

      toast.success(`Deal moved to ${targetStage}`)
    } catch (err) {
      toast.error("Failed to update deal stage")
    } finally {
      setDraggedDeal(null)
    }
  }

  const formatCurrency = (value) => {
    if (value === 0) return "$0"
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return <Loading variant="kanban" />
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.name)
          const stageValue = getStageValue(stage.name)
          
          return (
            <div key={stage.name} className="card p-4 text-center">
              <div className={`w-4 h-1 bg-gradient-to-r ${stage.color} rounded-full mx-auto mb-2`}></div>
              <h3 className="text-sm font-medium text-surface-700 mb-1">{stage.name}</h3>
              <div className="text-lg font-bold text-surface-900">{stageDeals.length}</div>
              <div className="text-xs text-surface-600">{formatCurrency(stageValue)}</div>
            </div>
          )
        })}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 min-h-96">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.name)
          
          return (
            <div
              key={stage.name}
              className="bg-gradient-to-b from-surface-50 to-white rounded-lg border border-surface-200 p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.name)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 bg-gradient-to-r ${stage.color} rounded-full`}></div>
                  <h3 className="font-medium text-surface-900">{stage.name}</h3>
                </div>
                <Badge variant="secondary" size="sm">
                  {stageDeals.length}
                </Badge>
              </div>

              <div className="space-y-3 custom-scrollbar max-h-[600px] overflow-y-auto">
                {stageDeals.length === 0 ? (
                  <div className="text-center py-8 text-surface-500">
                    <ApperIcon name="Inbox" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No deals in {stage.name.toLowerCase()}</p>
                  </div>
                ) : (
                  stageDeals.map((deal, index) => {
                    const contact = contacts[deal.contactId]
                    
                    return (
                      <motion.div
                        key={deal.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal)}
                        className="card p-4 cursor-move hover:shadow-card-hover transition-shadow duration-200 bg-white border-l-4 border-l-primary-400"
                      >
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-surface-900 text-sm mb-1 line-clamp-2">
                              {deal.title}
                            </h4>
                            <p className="text-xs text-surface-600">
                              {contact?.companyName || 'Unknown Contact'}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-lg font-bold text-surface-900">
                              {formatCurrency(deal.value)}
                            </div>
                            <div className="text-xs text-surface-500">
                              {deal.probability}%
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-surface-500">
                            <span>{deal.daysInStage}d in stage</span>
                            <Badge variant={getStageVariant(deal.stage)} size="sm">
                              {deal.stage}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                              <ApperIcon name="User" className="w-3 h-3 text-primary-600" />
                            </div>
                            <span className="text-xs text-surface-600 truncate">
                              {contact?.contactPerson}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}