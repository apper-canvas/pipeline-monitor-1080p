import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MetricCard from '@/components/molecules/MetricCard'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import dealService from '@/services/api/dealService'

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await dealService.getPipelineMetrics()
      setMetrics(data)
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
      title: "Won This Month",
      value: formatCurrency(metrics.closedWonValue),
      change: 24,
      changeType: "positive",
      icon: "Trophy",
      gradient: "from-green-500 to-green-600"
    },
    {
      title: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      change: 3,
      changeType: "positive",
      icon: "TrendingUp",
      gradient: "from-purple-500 to-purple-600"
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