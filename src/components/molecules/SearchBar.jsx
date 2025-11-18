import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import { cn } from '@/utils/cn'

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  onClear,
  className = "",
  showFilters = false,
  filters = [],
  onFilterChange,
  value = ""
}) {
  const [searchValue, setSearchValue] = useState(value)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  const handleSearch = (e) => {
    const newValue = e.target.value
    setSearchValue(newValue)
    if (onSearch) {
      onSearch(newValue)
    }
  }

  const handleClear = () => {
    setSearchValue("")
    if (onClear) {
      onClear()
    }
    if (onSearch) {
      onSearch("")
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" className="h-4 w-4 text-surface-400" />
        </div>
        
        <Input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearch}
          className="pl-10 pr-10"
        />
        
        {searchValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="X" className="h-4 w-4" />
          </button>
        )}
        
        {showFilters && (
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className={cn(
              "absolute inset-y-0 right-0 pr-3 flex items-center transition-colors",
              searchValue ? "pr-10" : "pr-3",
              isFiltersOpen ? "text-primary-600" : "text-surface-400 hover:text-surface-600"
            )}
          >
            <ApperIcon name="Filter" className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isFiltersOpen ? 'auto' : 0, 
            opacity: isFiltersOpen ? 1 : 0 
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="bg-white rounded-lg border border-surface-200 p-4 space-y-3">
            <h4 className="text-sm font-medium text-surface-900 mb-3">Filters</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((filter, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-xs font-medium text-surface-700">
                    {filter.label}
                  </label>
                  <select
                    value={filter.value || ""}
                    onChange={(e) => onFilterChange && onFilterChange(filter.key, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All {filter.label}</option>
                    {filter.options.map((option, optIndex) => (
                      <option key={optIndex} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-2 pt-3 border-t border-surface-200">
              <button
                onClick={() => {
                  filters.forEach(filter => onFilterChange && onFilterChange(filter.key, ""))
                }}
                className="btn-ghost text-xs"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsFiltersOpen(false)}
                className="btn-primary text-xs"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}