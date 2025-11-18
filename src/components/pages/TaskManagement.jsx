import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { format, formatDistanceToNow, isAfter, isBefore, startOfDay } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'
import ErrorView from '@/components/ui/ErrorView'
import activityService from '@/services/api/activityService'
import contactService from '@/services/api/contactService'
import dealService from '@/services/api/dealService'

export default function TaskManagement() {
  const navigate = useNavigate()
  const location = useLocation()
  const [tasks, setTasks] = useState([])
  const [contacts, setContacts] = useState({})
  const [deals, setDeals] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  })
  const [formData, setFormData] = useState({
    description: '',
    contactId: '',
    dealId: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
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

      // Filter only tasks
      const taskData = activitiesData.filter(activity => activity.type === 'Task')
      setTasks(taskData)

      // Create lookup objects
      const contactsLookup = {}
      contactsData.forEach(contact => {
        contactsLookup[contact.Id] = contact
      })
      setContacts(contactsLookup)

      const dealsLookup = {}
      dealsData.forEach(deal => {
        dealsLookup[deal.Id] = deal
      })
      setDeals(dealsLookup)
    } catch (err) {
      setError(err.message || "Failed to load tasks")
    } finally {
      setLoading(false)
    }
  }

useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setShowCreateModal(true)
      // Clear the state to prevent modal from reopening on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    try {
      const taskData = {
        ...formData,
        type: 'Task',
        status: 'Pending',
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null
      }

      await activityService.create(taskData)
      setShowCreateModal(false)
      setFormData({
        description: '',
        contactId: '',
        dealId: '',
        priority: 'Medium',
        dueDate: '',
        assignedTo: ''
      })
      toast.success('Task created successfully')
      loadData()
    } catch (err) {
      toast.error('Failed to create task')
    }
  }

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await activityService.update(taskId, updates)
      toast.success('Task updated successfully')
      loadData()
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    try {
      await activityService.delete(taskId)
      toast.success('Task deleted successfully')
      loadData()
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false
    if (filters.priority && task.priority !== filters.priority) return false
    if (filters.search && !task.description.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700'
      case 'Overdue': return 'bg-red-100 text-red-700'
      case 'In Progress': return 'bg-blue-100 text-blue-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700'
      case 'Medium': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            Task Management
          </h1>
          <p className="text-surface-600 text-lg">
            Create, assign, and track follow-up activities
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>New Task</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-surface-200 p-4 space-y-4">
        <h3 className="font-medium text-surface-900">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="status-filter">Status</Label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="input-field"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          <div>
            <Label htmlFor="priority-filter">Priority</Label>
            <select
              id="priority-filter"
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="input-field"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <Label htmlFor="search">Search Tasks</Label>
            <Input
              id="search"
              placeholder="Search descriptions..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          icon="CheckSquare"
          title="No tasks found"
          description="Create your first task to start managing follow-up activities"
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              Create Task
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <motion.div
              key={task.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-surface-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-surface-900 mb-1">
                    {task.description}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-surface-600">
                    <span>{contacts[task.contactId]?.companyName || 'Unassigned'}</span>
                    {deals[task.dealId] && (
                      <>
                        <span>•</span>
                        <span>{deals[task.dealId].title}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUpdateTask(task.Id, { 
                      status: task.status === 'Completed' ? 'Pending' : 'Completed' 
                    })}
                  >
                    <ApperIcon name={task.status === 'Completed' ? 'RotateCcw' : 'Check'} size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.Id)}
                  >
                    <ApperIcon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getStatusColor(task.status)} size="sm">
                  {task.status}
                </Badge>
                <Badge className={getPriorityColor(task.priority)} size="sm">
                  {task.priority} Priority
                </Badge>
              </div>

              {task.dueDate && (
                <div className="text-sm text-surface-600 mb-2">
                  <strong>Due:</strong> {format(new Date(task.dueDate), 'MMM d, yyyy h:mm a')}
                  <span className="ml-2 text-surface-500">
                    ({formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })})
                  </span>
                </div>
              )}

              {task.outcome && (
                <div className="text-sm text-surface-600 bg-surface-50 rounded p-2">
                  <strong>Outcome:</strong> {task.outcome}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-modal max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-surface-900">Create New Task</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <Label htmlFor="description">Task Description</Label>
                  <textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field min-h-[80px] resize-none"
                    placeholder="Describe the task..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact">Contact</Label>
                    <select
                      id="contact"
                      value={formData.contactId}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select Contact</option>
                      {Object.values(contacts).map(contact => (
                        <option key={contact.Id} value={contact.Id}>
                          {contact.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="deal">Deal (Optional)</Label>
                    <select
                      id="deal"
                      value={formData.dealId}
                      onChange={(e) => setFormData(prev => ({ ...prev, dealId: e.target.value }))}
                      className="input-field"
                    >
                      <option value="">Select Deal</option>
                      {Object.values(deals).map(deal => (
                        <option key={deal.Id} value={deal.Id}>
                          {deal.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                      className="input-field"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="datetime-local"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Task
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}