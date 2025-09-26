"use client"

import { useState, useEffect } from 'react'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Service } from '@/lib/types/database'
import { Edit, Trash2 } from 'lucide-react'

const channelLabels = {
  presencial: 'Presencial',
  telemedicina: 'Telemedicina',
  ambos: 'Ambos'
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services')
      const data = await response.json()
      if (response.ok) {
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/services?search=${encodeURIComponent(query)}`)
      const data = await response.json()
      if (response.ok) {
        setServices(data)
      }
    } catch (error) {
      console.error('Error searching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Servicio',
      render: (service: Service) => (
        <div className="flex items-center space-x-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: service.color }}
          />
          <div>
            <div className="font-medium">{service.name}</div>
            {service.description && (
              <div className="text-sm text-gray-500">{service.description}</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'duration_minutes',
      header: 'Duración',
      render: (service: Service) => `${service.duration_minutes} min`
    },
    {
      key: 'base_price',
      header: 'Precio',
      render: (service: Service) => `$${service.base_price.toLocaleString()}`
    },
    {
      key: 'channel',
      header: 'Canal',
      render: (service: Service) => (
        <Badge variant="outline">
          {channelLabels[service.channel]}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (service: Service) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Servicios</h1>
        <p className="text-gray-600">Gestiona el catálogo de servicios médicos</p>
      </div>

      <DataTable
        data={services}
        columns={columns}
        searchPlaceholder="Buscar servicios..."
        onSearch={handleSearch}
        onNew={() => console.log('Nuevo servicio')}
        newButtonText="Nuevo Servicio"
        loading={loading}
        emptyMessage="No se encontraron servicios"
      />
    </div>
  )
}