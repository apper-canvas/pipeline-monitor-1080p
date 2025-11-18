import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ActivitiesTimeline from '@/components/organisms/ActivitiesTimeline'
import activityService from '@/services/api/activityService'
import contactService from '@/services/api/contactService'
import dealService from '@/services/api/dealService'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Label from '@/components/atoms/Label'
export default function Activities() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(false)
const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [dealsLoading, setDealsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    type: 'call',
    description: '',
    contactId: '',
    dealId: '',
    scheduledFor: ''
  })

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setShowCreateModal(true)
      // Clear the state to prevent modal from opening again on refresh
      navigate(location.pathname, { replace: true })
    }
  }, [location.state, navigate, location.pathname])

const loadContacts = async () => {
    setContactsLoading(true)
    try {
      const contactsData = await contactService.getAll()
      setContacts(contactsData || [])
    } catch (error) {
      console.error('Failed to load contacts:', error)
      setContacts([])
    } finally {
      setContactsLoading(false)
    }
  }

  const loadDeals = async () => {
    setDealsLoading(true)
    try {
      const dealsData = await dealService.getAll()
      setDeals(dealsData || [])
    } catch (error) {
      console.error('Failed to load deals:', error)
      setDeals([])
    } finally {
      setDealsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.title.trim()) {
        toast.error('Activity title is required')
        return
      }

      const newActivity = {
        title: formData.title.trim(),
        type: formData.type,
        description: formData.description.trim(),
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        scheduledFor: formData.scheduledFor || new Date().toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      await activityService.create(newActivity)
      toast.success('Activity logged successfully!')
      
      // Reset form and close modal
      setFormData({
        title: '',
        type: 'call',
        description: '',
        contactId: '',
        dealId: '',
        scheduledFor: ''
      })
      setShowCreateModal(false)
      
      // Refresh the activities timeline
      window.location.reload()
    } catch (error) {
      toast.error('Failed to log activity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Load contacts and deals when modal opens
  useEffect(() => {
    if (showCreateModal) {
      loadContacts()
      loadDeals()
    }
  }, [showCreateModal])

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
Activities & Tasks
          </h1>
          <p className="text-surface-600 text-lg">
            Track interactions and manage follow-up tasks
            Track all interactions with your contacts and monitor your sales activities.
          </p>
        </motion.div>

        {/* Activities Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ActivitiesTimeline />
        </motion.section>
</div>

      {/* Create Activity Modal */}
      {showCreateModal && (
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-modal w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-surface-900">Log New Activity</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-surface-400 hover:text-surface-600 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Activity Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter activity title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Activity Type</Label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="call">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="note">Note</option>
                    <option value="task">Task</option>
                  </select>
                </div>

<div>
                  <Label htmlFor="contactId">Contact</Label>
                  <select
                    id="contactId"
                    name="contactId"
                    value={formData.contactId}
                    onChange={handleInputChange}
                    className="input-field"
                    disabled={contactsLoading}
                  >
                    <option value="">Select a contact</option>
                    {contactsLoading ? (
                      <option disabled>Loading contacts...</option>
                    ) : (
                      contacts.map(contact => (
                        <option key={contact.Id} value={contact.Id}>
                          {contact.contactPerson} - {contact.companyName}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <Label htmlFor="dealId">Deal</Label>
                  <select
                    id="dealId"
                    name="dealId"
                    value={formData.dealId}
                    onChange={handleInputChange}
                    className="input-field"
                    disabled={dealsLoading}
                  >
                    <option value="">Select a deal (optional)</option>
                    {dealsLoading ? (
                      <option disabled>Loading deals...</option>
                    ) : (
                      deals.map(deal => (
                        <option key={deal.Id} value={deal.Id}>
                          {deal.title} - ${deal.value?.toLocaleString()}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <Label htmlFor="scheduledFor">Scheduled Date & Time</Label>
                  <Input
                    id="scheduledFor"
                    name="scheduledFor"
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Activity details and notes"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : 'Log Activity'}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}