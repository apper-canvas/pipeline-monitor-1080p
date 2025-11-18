import { motion } from "framer-motion";
import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import RecentActivities from "@/components/organisms/RecentActivities";
import TopOpportunities from "@/components/organisms/TopOpportunities";
import DashboardMetrics from "@/components/organisms/DashboardMetrics";

export default function Dashboard() {
  const navigate = useNavigate();
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
            Dashboard
          </h1>
          <p className="text-surface-600 text-lg">
            Welcome back! Here's what's happening with your pipeline.
          </p>
        </motion.div>

        {/* Metrics Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DashboardMetrics />
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <RecentActivities limit={8} />
          </motion.div>

          {/* Top Opportunities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <TopOpportunities limit={10} />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-surface-900">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center space-x-3 p-6 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-200 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 group-hover:from-primary-200 group-hover:to-primary-300 rounded-xl flex items-center justify-center transition-colors">
                <motion.svg 
                  className="w-5 h-5 text-primary-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </motion.svg>
              </div>
              <span className="font-medium text-surface-900">Add Contact</span>
            </button>

            <button className="flex items-center justify-center space-x-3 p-6 rounded-xl border border-surface-200 hover:border-accent-300 hover:bg-gradient-to-br hover:from-accent-50 hover:to-primary-50 transition-all duration-200 group">
              <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 group-hover:from-accent-200 group-hover:to-accent-300 rounded-xl flex items-center justify-center transition-colors">
                <motion.svg 
                  className="w-5 h-5 text-accent-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </motion.svg>
              </div>
              <span className="font-medium text-surface-900">Create Deal</span>
            </button>

            <button className="flex items-center justify-center space-x-3 p-6 rounded-xl border border-surface-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-primary-50 transition-all duration-200 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 rounded-xl flex items-center justify-center transition-colors">
                <motion.svg 
                  className="w-5 h-5 text-green-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </motion.svg>
</div>
              <span className="font-medium text-surface-900">Log Activity</span>
            </button>

            {/* Tasks Quick Action */}
            <button
              onClick={() => navigate('/tasks')}
              className="flex flex-col items-center space-y-3 p-6 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 rounded-xl flex items-center justify-center transition-colors">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-purple-600" />
              </div>
              <span className="font-medium text-surface-900">Manage Tasks</span>
            </button>

            <button className="flex items-center justify-center space-x-3 p-6 rounded-xl border border-surface-200 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-primary-50 transition-all duration-200 group">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 rounded-xl flex items-center justify-center transition-colors">
                <motion.svg 
                  className="w-5 h-5 text-purple-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </motion.svg>
              </div>
              <span className="font-medium text-surface-900">View Reports</span>
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  )
}