import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import ErrorView from "@/components/ui/ErrorView";
import Pipeline from "@/components/pages/Pipeline";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

export default function ContactsTable() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    industry: "",
    companySize: "",
    hasActiveDeals: ""
  })
  const [selectedContact, setSelectedContact] = useState(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [contactsData, dealsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ])
      
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (err) {
      setError(err.message || "Failed to load contacts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return
    
    try {
      await contactService.delete(contactId)
      setContacts(contacts.filter(c => c.Id !== contactId))
      toast.success("Contact deleted successfully")
    } catch (err) {
      toast.error("Failed to delete contact")
    }
  }

  // Filter and search logic
  const filteredContacts = useMemo(() => {
    let filtered = [...contacts]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(contact =>
        contact.companyName.toLowerCase().includes(query) ||
        contact.contactPerson.toLowerCase().includes(query) ||
        contact.email.toLowerCase().includes(query) ||
        contact.industry.toLowerCase().includes(query)
      )
    }

    // Industry filter
    if (filters.industry) {
      filtered = filtered.filter(contact => contact.industry === filters.industry)
    }

    // Company size filter
    if (filters.companySize) {
      filtered = filtered.filter(contact => contact.companySize === filters.companySize)
    }

    // Active deals filter
    if (filters.hasActiveDeals) {
      const contactsWithActiveDeals = deals
        .filter(deal => !['Closed Won', 'Closed Lost'].includes(deal.stage))
        .map(deal => deal.contactId)
      
      if (filters.hasActiveDeals === "yes") {
        filtered = filtered.filter(contact => contactsWithActiveDeals.includes(contact.Id))
      } else if (filters.hasActiveDeals === "no") {
        filtered = filtered.filter(contact => !contactsWithActiveDeals.includes(contact.Id))
      }
    }

    return filtered
  }, [contacts, searchQuery, filters, deals])

  const getContactDeals = (contactId) => {
    return deals.filter(deal => deal.contactId === contactId)
  }

  const getActiveDealsCount = (contactId) => {
    return deals.filter(deal => 
      deal.contactId === contactId && 
      !['Closed Won', 'Closed Lost'].includes(deal.stage)
    ).length
  }

  const getTotalDealValue = (contactId) => {
    return deals
      .filter(deal => deal.contactId === contactId && !['Closed Won', 'Closed Lost'].includes(deal.stage))
      .reduce((sum, deal) => sum + deal.value, 0)
  }

  // Filter options
  const filterOptions = [
    {
      key: "industry",
      label: "Industry",
      value: filters.industry,
      options: [...new Set(contacts.map(c => c.industry))].map(industry => ({
        value: industry,
        label: industry
      }))
    },
    {
      key: "companySize", 
      label: "Company Size",
      value: filters.companySize,
      options: [...new Set(contacts.map(c => c.companySize))].map(size => ({
        value: size,
        label: size
      }))
    },
    {
      key: "hasActiveDeals",
      label: "Active Deals",
      value: filters.hasActiveDeals,
      options: [
        { value: "yes", label: "Has Active Deals" },
        { value: "no", label: "No Active Deals" }
      ]
    }
  ]

  if (loading) {
    return <Loading variant="table" />
  }

  if (error) {
    return <ErrorView error={error} onRetry={loadData} />
  }

  if (contacts.length === 0) {
    return (
      <Empty
        title="No contacts found"
        description="Start building your pipeline by adding your first contact"
        actionLabel="Add First Contact"
        icon="Users"
      />
    )
  }

  const formatCurrency = (value) => {
    if (value === 0) return "$0"
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <SearchBar
        placeholder="Search contacts by company, name, email, or industry..."
        value={searchQuery}
        onSearch={setSearchQuery}
        showFilters={true}
        filters={filterOptions}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
      />

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-600">
          Showing {filteredContacts.length} of {contacts.length} contacts
        </p>
        
      </div>

      {/* Contacts Table */}
      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts match your search"
          description="Try adjusting your search terms or filters"
          icon="Search"
          variant="card"
        />
      ) : (
        <div className="bg-white rounded-lg border border-surface-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-200">
              <thead className="bg-gradient-to-r from-surface-50 to-surface-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Active Deals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Pipeline Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-surface-200">
                {filteredContacts.map((contact, index) => {
                  const activeDealsCount = getActiveDealsCount(contact.Id)
                  const totalValue = getTotalDealValue(contact.Id)
                  
                  return (
                    <motion.tr
                      key={contact.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gradient-to-r hover:from-surface-50 hover:to-primary-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center">
                            <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-surface-900">
                              {contact.contactPerson}
                            </div>
                            <div className="text-sm text-surface-500">
                              {contact.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-surface-900">
                            {contact.companyName}
                          </div>
                          <div className="text-sm text-surface-500">
                            {contact.companySize} employees
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="secondary" size="sm">
                          {contact.industry}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-900">
                        {activeDealsCount > 0 ? (
                          <span className="font-medium text-primary-600">
                            {activeDealsCount} {activeDealsCount === 1 ? 'deal' : 'deals'}
                          </span>
                        ) : (
                          <span className="text-surface-500">No active deals</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-surface-900">
                        {formatCurrency(totalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500">
                        {formatDistanceToNow(new Date(contact.lastActivity), { addSuffix: true })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Eye"
                          onClick={() => setSelectedContact(contact)}
                        />
<Button
                          variant="ghost"
                          size="sm"
                          icon="Edit"
                          onClick={() => navigate(`/contacts?edit=${contact.Id}`)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Trash2"
                          onClick={() => handleDeleteContact(contact.Id)}
                          className="text-red-600 hover:text-red-700"
                        />
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}