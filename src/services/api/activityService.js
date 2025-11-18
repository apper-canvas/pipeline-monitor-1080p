import activitiesData from '@/services/mockData/activities.json'

class ActivityService {
  constructor() {
    this.activities = [...activitiesData]
    this.activityTypes = ['Email', 'Call', 'Meeting', 'Note', 'Task']
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
    this.activities.push(newActivity)
    return { ...newActivity }
  }

  async update(id, activityData) {
    await this.delay(300)
    const index = this.activities.findIndex(a => a.Id === parseInt(id))
    if (index === -1) return null
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData,
      Id: parseInt(id)
    }
    return { ...this.activities[index] }
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