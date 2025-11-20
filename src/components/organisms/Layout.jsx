import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showQuickAddModal, setShowQuickAddModal] = useState(false)
  const navigate = useNavigate()

  const navigationItems = [
    { name: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
    { name: 'Contacts', path: '/contacts', icon: 'Users' },
    { name: 'Pipeline', path: '/pipeline', icon: 'GitBranch' },
    { name: 'Activities', path: '/activities', icon: 'Clock' },
{ name: 'Tasks', path: '/tasks', icon: 'CheckSquare' }
  ]

  const handleQuickAdd = () => {
    setShowQuickAddModal(true)
  }

const handleQuickAddContact = () => {
    setShowQuickAddModal(false)
    navigate('/contacts?showCreateModal=true')
  }

const handleQuickAddDeal = () => {
    setShowQuickAddModal(false)
    navigate('/pipeline', { state: { openCreateModal: true } })
  }

const handleQuickAddTask = () => {
setShowQuickAddModal(false)
  navigate('/tasks', { state: { openCreateModal: true } })
}

const handleQuickAddActivity = () => {
  setShowQuickAddModal(false)
  navigate('/activities', { state: { openCreateModal: true } })
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-200/60 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" className="w-5 h-5 text-white" />
                </div>
<h1 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
                  Pipeline ProMax
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 shadow-sm border border-primary-200/50'
                        : 'text-surface-600 hover:text-primary-700 hover:bg-gradient-to-r hover:from-surface-50 hover:to-primary-50'
                    }`
                  }
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Quick Add Button */}
              <button
                onClick={handleQuickAdd}
                className="btn-primary text-sm"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Quick Add</span>
                <span className="sm:hidden">Add</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-surface-600 hover:text-primary-700 hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name={isMobileMenuOpen ? 'X' : 'Menu'} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-surface-200 bg-white/90 backdrop-blur-xl"
            >
              <div className="px-4 py-3 space-y-1">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 shadow-sm border border-primary-200/50'
                          : 'text-surface-600 hover:text-primary-700 hover:bg-gradient-to-r hover:from-surface-50 hover:to-primary-50'
                      }`
                    }
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowQuickAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-modal p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-surface-900 mb-2">
                    What would you like to add?
                  </h3>
                  <p className="text-surface-600 text-sm">
                    Choose what you'd like to create
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleQuickAddContact}
                    className="flex flex-col items-center space-y-3 p-6 rounded-xl border border-surface-200 hover:border-primary-300 hover:bg-gradient-to-br hover:from-primary-50 hover:to-accent-50 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 group-hover:from-primary-200 group-hover:to-primary-300 rounded-xl flex items-center justify-center transition-colors">
                      <ApperIcon name="UserPlus" className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-medium text-surface-900">Contact</div>
                      <div className="text-xs text-surface-600">Add new contact</div>
                    </div>
                  </button>

<button
                    onClick={handleQuickAddDeal}
                    className="flex flex-col items-center space-y-3 p-6 rounded-xl border border-surface-200 hover:border-accent-300 hover:bg-gradient-to-br hover:from-accent-50 hover:to-primary-50 transition-all duration-200 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 group-hover:from-accent-200 group-hover:to-accent-300 rounded-xl flex items-center justify-center transition-colors">
                      <ApperIcon name="DollarSign" className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <div className="font-medium text-surface-900">Deal</div>
                      <div className="text-xs text-surface-600">Create new deal</div>
                    </div>
                  </button>

{/* Quick Add Task */}
                <button
                  onClick={handleQuickAddTask}
                  className="flex flex-col items-center space-y-3 p-6 rounded-xl border border-surface-200 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-primary-50 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 rounded-xl flex items-center justify-center transition-colors">
                    <ApperIcon name="CheckSquare" className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-surface-900">Task</div>
                    <div className="text-xs text-surface-600">Create new task</div>
                  </div>
                </button>

                {/* Quick Add Activity */}
                <button
                  onClick={handleQuickAddActivity}
                  className="flex flex-col items-center space-y-3 p-6 rounded-xl border border-surface-200 hover:border-green-300 hover:bg-gradient-to-br hover:from-green-50 hover:to-primary-50 transition-all duration-200 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 rounded-xl flex items-center justify-center transition-colors">
                    <ApperIcon name="Activity" className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-surface-900">Activity</div>
                    <div className="text-xs text-surface-600">Log new activity</div>
                  </div>
                </button>
                </div>

                <button
                  onClick={() => setShowQuickAddModal(false)}
                  className="w-full btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}