"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Patient } from '@/lib/types/database'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Eye, Edit, Phone, Mail } from 'lucide-react'

export default function PatientsPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients')
      const result = await response.json()
      if (response.ok) {
        setPatients(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/patients?search=${encodeURIComponent(query)}`)
      const result = await response.json()
      if (response.ok) {
        setPatients(result.data || [])
      }
    } catch (error) {
      console.error('Error searching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Nombre',
      render: (patient: Patient) => (
        <div>
          <div className="font-medium">{patient.first_name} {patient.last_name}</div>
          <div className="text-sm text-gray-500">
            {patient.date_of_birth ? format(new Date(patient.date_of_birth), 'dd/MM/yyyy', { locale: es }) : 'Sin fecha'}
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contacto',
      render: (patient: Patient) => (
        <div className="space-y-1">
          {patient.phone && (
            <div className="flex items-center text-sm">
              <Phone className="h-3 w-3 mr-1" />
              {patient.phone}
            </div>
          )}
          {patient.email && (
            <div className="flex items-center text-sm">
              <Mail className="h-3 w-3 mr-1" />
              {patient.email}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'tags',
      header: 'Etiquetas',
      render: (patient: Patient) => (
        <div className="flex flex-wrap gap-1">
          {patient.tags?.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: 'created_at',
      header: 'Registrado',
      render: (patient: Patient) => (
        format(new Date(patient.created_at), 'dd/MM/yyyy', { locale: es })
      )
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (patient: Patient) => (
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.push(`/patients/${patient.id}/edit`)}
            title="Editar paciente"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
        <p className="text-gray-600">Gestiona la información de tus pacientes</p>
      </div>

      <DataTable
        data={patients}
        columns={columns}
        searchPlaceholder="Buscar por nombre, teléfono o email..."
        onSearch={handleSearch}
        onNew={() => router.push('/patients/new')}
        newButtonText="Nuevo Paciente"
        loading={loading}
        emptyMessage="No se encontraron pacientes"
      />
    </div>
  )
}