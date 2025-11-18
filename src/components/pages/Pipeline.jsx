import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import PipelineBoard from '@/components/organisms/PipelineBoard'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
import dealService from '@/services/api/dealService'
import contactService from '@/services/api/contactService'

export default function Pipeline() {
  const location = useLocation()
const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editDeal, setEditDeal] = useState(null)
  const [contacts, setContacts] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    value: '',
    probability: '50',
    expectedCloseDate: '',
    description: ''
  })

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll()
      setContacts(contactsData)
    } catch (err) {
      console.error('Failed to load contacts:', err)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setShowCreateModal(true)
      // Clear the state to prevent modal from reopening on refresh
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

const handleCreateDeal = async (e) => {
    e.preventDefault()
    try {
      const dealData = {
        ...formData,
        stage: 'Lead',
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        value: parseFloat(formData.value) || 0,
        probability: parseInt(formData.probability),
        daysInStage: 0
      }

      await dealService.create(dealData)
      setShowCreateModal(false)
      setFormData({
        title: '',
        contactId: '',
        value: '',
        probability: '50',
        expectedCloseDate: '',
        description: ''
      })
      toast.success('Deal created successfully')
    } catch (err) {
      toast.error('Failed to create deal')
    }
  }

  const handleEditDeal = async (e) => {
    e.preventDefault()
    try {
      const dealData = {
        ...formData,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        value: parseFloat(formData.value) || 0,
        probability: parseInt(formData.probability),
      }

      await dealService.update(editDeal.Id, dealData)
      setShowEditModal(false)
      setEditDeal(null)
      setFormData({
        title: '',
        contactId: '',
        value: '',
        probability: '50',
        expectedCloseDate: '',
        description: ''
      })
      toast.success('Deal updated successfully')
    } catch (err) {
      toast.error('Failed to update deal')
    }
  }

  const onEditDeal = (deal) => {
    setEditDeal(deal)
    setFormData({
      title: deal.title || '',
      contactId: deal.contactId?.toString() || '',
      value: deal.value?.toString() || '',
      probability: deal.probability?.toString() || '50',
      expectedCloseDate: deal.expectedCloseDate || '',
      description: deal.description || ''
    })
    setShowEditModal(true)
  }
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-surface-900 via-primary-800 to-primary-900 bg-clip-text text-transparent">
                Sales Pipeline
              </h1>
              <p className="text-surface-600 text-lg">
                Track your deals through every stage of the sales process with drag-and-drop simplicity.
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2"
            >
              <ApperIcon name="Plus" size={16} />
              <span>New Deal</span>
            </Button>
          </div>
        </motion.div>

        {/* Pipeline Board */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
<PipelineBoard onEditDeal={onEditDeal} />
        </motion.section>

        {/* Create Deal Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-modal max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-surface-900">Create New Deal</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateModal(false)}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>

                <form onSubmit={handleCreateDeal} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Deal Title</Label>
                    <Input
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter deal title..."
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
                        {contacts.map(contact => (
                          <option key={contact.Id} value={contact.Id}>
                            {contact.companyName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="value">Deal Value</Label>
                      <Input
                        id="value"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="probability">Probability (%)</Label>
                      <Input
                        id="probability"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.probability}
                        onChange={(e) => setFormData(prev => ({ ...prev, probability: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                      <Input
                        id="expectedCloseDate"
                        type="date"
                        value={formData.expectedCloseDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field min-h-[80px] resize-none"
                      placeholder="Deal description..."
                    />
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
                      Create Deal
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
)}

        {/* Edit Deal Modal */}
        {showEditModal && editDeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-modal max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-surface-900">Edit Deal</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditDeal(null)
                    }}
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>

                <form onSubmit={handleEditDeal} className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Deal Title</Label>
                    <Input
                      id="edit-title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter deal title..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-contact">Contact</Label>
                      <select
                        id="edit-contact"
                        value={formData.contactId}
                        onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                        className="input-field"
                      >
                        <option value="">Select Contact</option>
                        {contacts.map(contact => (
                          <option key={contact.Id} value={contact.Id}>
                            {contact.companyName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="edit-value">Deal Value</Label>
                      <Input
                        id="edit-value"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-probability">Probability (%)</Label>
                      <Input
                        id="edit-probability"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.probability}
                        onChange={(e) => setFormData(prev => ({ ...prev, probability: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-expectedCloseDate">Expected Close Date</Label>
                      <Input
                        id="edit-expectedCloseDate"
                        type="date"
                        value={formData.expectedCloseDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-description">Description (Optional)</Label>
                    <textarea
                      id="edit-description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field min-h-[80px] resize-none"
                      placeholder="Deal description..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-surface-200">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowEditModal(false)
                        setEditDeal(null)
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      Update Deal
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}