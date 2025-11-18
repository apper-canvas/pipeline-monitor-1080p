import contactsData from '@/services/mockData/contacts.json'

class ContactService {
  constructor() {
    this.contacts = [...contactsData]
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async getAll() {
    await this.delay()
    return [...this.contacts].sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
  }

  async getById(id) {
    await this.delay(200)
    const contact = this.contacts.find(c => c.Id === parseInt(id))
    return contact ? { ...contact } : null
  }

  async create(contactData) {
    await this.delay(400)
    const newContact = {
      ...contactData,
      Id: Math.max(...this.contacts.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    }
    this.contacts.push(newContact)
    return { ...newContact }
  }

  async update(id, contactData) {
    await this.delay(300)
    const index = this.contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) return null
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id),
      lastActivity: new Date().toISOString()
    }
    return { ...this.contacts[index] }
  }

  async delete(id) {
    await this.delay(250)
    const index = this.contacts.findIndex(c => c.Id === parseInt(id))
    if (index === -1) return false
    
    this.contacts.splice(index, 1)
    return true
  }

  async searchContacts(query) {
    await this.delay(200)
    const lowercaseQuery = query.toLowerCase()
    return this.contacts.filter(contact =>
      contact.companyName.toLowerCase().includes(lowercaseQuery) ||
      contact.contactPerson.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.industry.toLowerCase().includes(lowercaseQuery)
    )
  }

  async getContactsByIndustry(industry) {
    await this.delay(200)
    return this.contacts.filter(contact => 
      contact.industry.toLowerCase() === industry.toLowerCase()
    )
  }

  async getRecentContacts(limit = 5) {
    await this.delay(200)
    return [...this.contacts]
      .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
      .slice(0, limit)
  }
}

export default new ContactService()