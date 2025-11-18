import dealsData from '@/services/mockData/deals.json'

class DealService {
  constructor() {
    this.deals = [...dealsData]
    this.stages = ['Lead', 'Qualified', 'Demo', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.deals].map(deal => ({
      ...deal,
      daysInStage: this.calculateDaysInStage(deal.movedToStageAt)
    }))
  }

  async getById(id) {
    await this.delay(200)
    const deal = this.deals.find(d => d.Id === parseInt(id))
    if (!deal) return null
    
    return {
      ...deal,
      daysInStage: this.calculateDaysInStage(deal.movedToStageAt)
    }
  }

  async create(dealData) {
    await this.delay(400)
    const newDeal = {
      ...dealData,
      Id: Math.max(...this.deals.map(d => d.Id)) + 1,
      createdAt: new Date().toISOString(),
      movedToStageAt: new Date().toISOString(),
      daysInStage: 0
    }
    this.deals.push(newDeal)
    return { ...newDeal }
  }

  async update(id, dealData) {
    await this.delay(300)
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) return null
    
    const oldStage = this.deals[index].stage
    const newStage = dealData.stage
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      Id: parseInt(id),
      movedToStageAt: oldStage !== newStage ? new Date().toISOString() : this.deals[index].movedToStageAt
    }
    
    return {
      ...this.deals[index],
      daysInStage: this.calculateDaysInStage(this.deals[index].movedToStageAt)
    }
  }

  async updateStage(id, newStage) {
    await this.delay(250)
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) return null
    
    this.deals[index] = {
      ...this.deals[index],
      stage: newStage,
      movedToStageAt: new Date().toISOString(),
      probability: this.getProbabilityForStage(newStage)
    }
    
    return {
      ...this.deals[index],
      daysInStage: 0
    }
  }

  async delete(id) {
    await this.delay(250)
    const index = this.deals.findIndex(d => d.Id === parseInt(id))
    if (index === -1) return false
    
    this.deals.splice(index, 1)
    return true
  }

  async getDealsByStage(stage) {
    await this.delay(200)
    return this.deals
      .filter(deal => deal.stage === stage)
      .map(deal => ({
        ...deal,
        daysInStage: this.calculateDaysInStage(deal.movedToStageAt)
      }))
  }

  async getDealsByContact(contactId) {
    await this.delay(200)
    return this.deals
      .filter(deal => deal.contactId === parseInt(contactId))
      .map(deal => ({
        ...deal,
        daysInStage: this.calculateDaysInStage(deal.movedToStageAt)
      }))
  }

  async getPipelineMetrics() {
    await this.delay(300)
    const activeDeals = this.deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage))
    const closedWonDeals = this.deals.filter(d => d.stage === 'Closed Won')
    const totalPipelineValue = activeDeals.reduce((sum, deal) => sum + deal.value, 0)
    const closedWonValue = closedWonDeals.reduce((sum, deal) => sum + deal.value, 0)
    
    const stageMetrics = this.stages.reduce((acc, stage) => {
      const stageDeals = this.deals.filter(d => d.stage === stage)
      acc[stage] = {
        count: stageDeals.length,
        value: stageDeals.reduce((sum, deal) => sum + deal.value, 0),
        averageDays: stageDeals.length > 0 
          ? Math.round(stageDeals.reduce((sum, deal) => sum + this.calculateDaysInStage(deal.movedToStageAt), 0) / stageDeals.length)
          : 0
      }
      return acc
    }, {})

    return {
      totalPipelineValue,
      totalDeals: activeDeals.length,
      closedWonValue,
      closedWonCount: closedWonDeals.length,
      averageDealSize: activeDeals.length > 0 ? Math.round(totalPipelineValue / activeDeals.length) : 0,
      conversionRate: this.deals.length > 0 ? Math.round((closedWonDeals.length / this.deals.length) * 100) : 0,
      stageMetrics
    }
  }

  calculateDaysInStage(movedToStageAt) {
    const now = new Date()
    const stageDate = new Date(movedToStageAt)
    const diffTime = Math.abs(now - stageDate)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  getProbabilityForStage(stage) {
    const stageProbabilities = {
      'Lead': 25,
      'Qualified': 45,
      'Demo': 60,
      'Proposal': 75,
      'Negotiation': 85,
      'Closed Won': 100,
      'Closed Lost': 0
    }
    return stageProbabilities[stage] || 50
  }

  getStages() {
    return [...this.stages]
  }
}

export default new DealService()