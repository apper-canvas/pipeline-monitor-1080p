import activitiesData from '@/services/mockData/activities.json'

class ActivityService {
  constructor() {
    this.activities = [...activitiesData]
this.activityTypes = ['Email', 'Call', 'Meeting', 'Note', 'Task']
    this.taskStatuses = ['Pending', 'In Progress', 'Completed', 'Overdue']
    this.taskPriorities = ['Low', 'Medium', 'High']
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getById(id) {
    await this.delay(200)
    const activity = this.activities.find(a => a.Id === parseInt(id))
    return activity ? { ...activity } : null
  }

async create(activityData) {
    await this.delay(400)
    const newActivity = {
      ...activityData,
      Id: Math.max(...this.activities.map(a => a.Id)) + 1,
      timestamp: new Date().toISOString()
    }
    
    // Handle lookup fields - support both ID-based and legacy text-based
    if (activityData.contactId) {
      newActivity.contactId = parseInt(activityData.contactId)
      // Remove legacy text field if ID provided
      delete newActivity.contactName
    }
    
    if (activityData.dealId) {
      newActivity.dealId = parseInt(activityData.dealId)
      // Remove legacy text field if ID provided  
      delete newActivity.dealName
    }
    
    // Handle task-specific fields
    if (activityData.type === 'Task') {
      newActivity.status = activityData.status || 'Pending'
      newActivity.priority = activityData.priority || 'Medium'
      newActivity.assignedTo = activityData.assignedTo || null
      newActivity.dueDate = activityData.dueDate || null
      
      // Auto-set overdue status if due date has passed
      if (newActivity.dueDate && new Date(newActivity.dueDate) < new Date()) {
        newActivity.status = 'Overdue'
      }
    }
    
    this.activities.push(newActivity)
    return { ...newActivity }
  }

async update(id, activityData) {
    await this.delay(300)
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) return null
    
    const updatedData = { ...activityData }
    
    // Handle lookup fields - support both ID-based and legacy text-based
    if (activityData.contactId) {
      updatedData.contactId = parseInt(activityData.contactId)
      // Remove legacy text field if ID provided
      delete updatedData.contactName
    }
    
    if (activityData.dealId) {
      updatedData.dealId = parseInt(activityData.dealId)
      // Remove legacy text field if ID provided
      delete updatedData.dealName
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...updatedData,
      Id: parseInt(id)
    }
    
    // Handle task status updates
    if (this.activities[index].type === 'Task' && activityData.dueDate) {
      if (new Date(activityData.dueDate) < new Date() && activityData.status !== 'Completed') {
        this.activities[index].status = 'Overdue'
      }
    }
    
    return { ...this.activities[index] }
  }
  
  async getTasksByStatus(status) {
    await this.delay(200)
    return this.activities.filter(a => a.type === 'Task' && a.status === status)
  }
  
  async getOverdueTasks() {
    await this.delay(200)
    const now = new Date()
    return this.activities.filter(a => 
      a.type === 'Task' && 
      a.dueDate && 
      new Date(a.dueDate) < now && 
      a.status !== 'Completed'
    )
  }
  
  async getTaskMetrics() {
    await this.delay(200)
    const tasks = this.activities.filter(a => a.type === 'Task')
    const completed = tasks.filter(t => t.status === 'Completed')
    const overdue = tasks.filter(t => t.status === 'Overdue')
    const pending = tasks.filter(t => t.status === 'Pending')
    const inProgress = tasks.filter(t => t.status === 'In Progress')
    
    return {
      total: tasks.length,
      completed: completed.length,
      overdue: overdue.length,
      pending: pending.length,
      inProgress: inProgress.length,
      completionRate: tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0
    }
  }

  async delete(id) {
    await this.delay(250)
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) return false
    
    this.activities.splice(index, 1)
    return true
  }

  async getActivitiesByContact(contactId) {
    await this.delay(200)
    return this.activities
      .filter(activity => activity.contactId === parseInt(contactId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getActivitiesByDeal(dealId) {
    await this.delay(200)
    return this.activities
      .filter(activity => activity.dealId === parseInt(dealId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getActivitiesByType(type) {
    await this.delay(200)
    return this.activities
      .filter(activity => activity.type === type)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getRecentActivities(limit = 10) {
    await this.delay(200)
    return [...this.activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  }

  async getActivitiesByDateRange(startDate, endDate) {
    await this.delay(250)
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    return this.activities
      .filter(activity => {
        const activityDate = new Date(activity.timestamp)
        return activityDate >= start && activityDate <= end
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  async getActivityMetrics() {
    await this.delay(300)
    const now = new Date()
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const thisWeekActivities = this.activities.filter(a => new Date(a.timestamp) >= thisWeek)
    const thisMonthActivities = this.activities.filter(a => new Date(a.timestamp) >= thisMonth)
    
    const typeMetrics = this.activityTypes.reduce((acc, type) => {
      const typeActivities = this.activities.filter(a => a.type === type)
      acc[type] = {
        total: typeActivities.length,
        thisWeek: typeActivities.filter(a => new Date(a.timestamp) >= thisWeek).length,
        thisMonth: typeActivities.filter(a => new Date(a.timestamp) >= thisMonth).length
      }
      return acc
    }, {})

    return {
      totalActivities: this.activities.length,
      thisWeekActivities: thisWeekActivities.length,
      thisMonthActivities: thisMonthActivities.length,
      averagePerDay: Math.round(thisWeekActivities.length / 7),
      typeMetrics
    }
  }

  getActivityTypes() {
    return [...this.activityTypes]
  }
}

export default new ActivityService()