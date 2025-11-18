import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import dealService from '@/services/api/dealService'
import activityService from '@/services/api/activityService'

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState(null)
  const [taskMetrics, setTaskMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      const [dealData, taskData] = await Promise.all([
        dealService.getPipelineMetrics(),
        activityService.getTaskMetrics()
      ])
      setMetrics(dealData)
      setTaskMetrics(taskData)
    } catch (err) {
      setError(err.message || "Failed to load metrics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <MetricCard key={i} loading={true} />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadMetrics} variant="card" />
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const metricCards = [
    {
      title: "Total Pipeline Value",
      value: formatCurrency(metrics.totalPipelineValue),
      change: 12,
      changeType: "positive",
      icon: "DollarSign",
      gradient: "from-primary-500 to-primary-600"
    },
    {
      title: "Active Deals",
      value: metrics.totalDeals.toString(),
      change: 8,
      changeType: "positive", 
      icon: "GitBranch",
      gradient: "from-accent-500 to-accent-600"
    },
    {
      title: "Task Completion",
      value: `${taskMetrics.completionRate}%`,
      change: taskMetrics.completionRate > 75 ? 15 : taskMetrics.completionRate > 50 ? 5 : -10,
      changeType: taskMetrics.completionRate > 75 ? "positive" : taskMetrics.completionRate > 50 ? "neutral" : "negative",
      icon: "CheckSquare",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      title: "Overdue Tasks",
      value: taskMetrics.overdue.toString(),
      change: taskMetrics.overdue > 0 ? -20 : 0,
      changeType: taskMetrics.overdue > 0 ? "negative" : "positive",
      icon: "Clock",
      gradient: "from-orange-500 to-red-600"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <MetricCard {...card} />
        </motion.div>
      ))}
    </div>
  )
}