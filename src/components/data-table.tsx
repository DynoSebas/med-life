"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Search, Filter, Plus } from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T, value: any) => React.ReactNode
  sortable?: boolean
  className?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  onFilter?: () => void
  onNew?: () => void
  newButtonText?: string
  className?: string
  loading?: boolean
  emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  searchPlaceholder = "Buscar...",
  onSearch,
  onFilter,
  onNew,
  newButtonText = "Nuevo",
  className,
  loading = false,
  emptyMessage = "No hay datos disponibles"
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const getValue = (item: T, key: string): any => {
    const keys = key.split('.')
    return keys.reduce((obj, k) => obj?.[k], item)
  }

  if (loading) {
    return (
      <div className={cn("bg-white rounded-lg border", className)}>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-lg border", className)}>
      {/* Header with search and actions */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter button */}
          {onFilter && (
            <Button variant="outline" size="sm" onClick={onFilter}>
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          )}
        </div>

        {/* New button */}
        {onNew && (
          <Button 
            onClick={onNew}
            className="text-white font-medium transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-95 border-0"
            style={{backgroundColor: '#EC5E27'}}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d44a1f'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#EC5E27'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(0.98)'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px) scale(1)'
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            {newButtonText}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column, colIndex) => {
                    const value = getValue(item, column.key as string)
                    return (
                      <td
                        key={colIndex}
                        className={cn(
                          "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                          column.className
                        )}
                      >
                        {column.render ? column.render(item, value) : value}
                      </td>
                    )
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}