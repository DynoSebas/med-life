'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CalendarDays, 
  Plus, 
  FileText, 
  Eye,
  Edit,
  Filter,
  Search,
  Activity,
  Stethoscope
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Consultation, Patient } from '@/lib/types/database'

interface ConsultationStats {
  total: number
  this_month: number
  by_status: {
    completed: number
    draft: number
    cancelled: number
  }
}

interface ConsultationWithDetails extends Consultation {
  patient_name: string
  patient_birth_date: string
  patient_age: number
  doctor_name: string | null
  doctor_role: string | null
}

export default function PatientConsultationsPage() {
  const params = useParams()
  const patientId = params.id as string

  const [patient, setPatient] = useState<Patient | null>(null)
  const [consultations, setConsultations] = useState<ConsultationWithDetails[]>([])
  const [stats, setStats] = useState<ConsultationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchConsultations = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (statusFilter) queryParams.append('status', statusFilter)

      const response = await fetch(`/api/patients/${patientId}/consultations?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar las consultas')
      }

      const data = await response.json()
      setPatient(data.patient)
      setConsultations(data.consultations)
      setStats(data.stats)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error fetching consultations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (patientId) {
      fetchConsultations()
    }
  }, [patientId, currentPage, statusFilter])

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      draft: 'secondary',
      cancelled: 'destructive'
    } as const

    const labels = {
      completed: 'Completada',
      draft: 'Borrador',
      cancelled: 'Cancelada'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDiagnosesPreview = (diagnoses: string[] | null) => {
    if (!diagnoses || diagnoses.length === 0) return 'Sin diagnósticos'
    if (diagnoses.length === 1) return diagnoses[0]
    return `${diagnoses[0]} +${diagnoses.length - 1} más`
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Consultas de {patient?.first_name} {patient?.last_name}
          </h1>
          <p className="text-muted-foreground">
            Historial médico y consultas registradas
          </p>
        </div>
        <Link href={`/patients/${patientId}/consultations/new`}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Consulta
          </Button>
        </Link>
      </div>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consultas</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.this_month}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.by_status.completed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Borradores</CardTitle>
              <Stethoscope className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.by_status.draft}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtrar Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar en notas, diagnósticos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos los estados</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('')
                }}
              >
                Limpiar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabla de consultas */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          {consultations.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay consultas registradas
              </h3>
              <p className="text-gray-500 mb-4">
                Comienza creando la primera consulta para este paciente.
              </p>
              <Link href={`/patients/${patientId}/consultations/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Consulta
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Diagnósticos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consultations.map((consultation) => (
                    <TableRow key={consultation.id}>
                      <TableCell className="font-medium">
                        {formatDate(consultation.consultation_date)}
                        {consultation.consultation_time && (
                          <div className="text-sm text-muted-foreground">
                            {consultation.consultation_time}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {consultation.doctor_name || 'No asignado'}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {getDiagnosesPreview(consultation.diagnoses_cie10)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(consultation.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/patients/${patientId}/consultations/${consultation.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/patients/${patientId}/consultations/${consultation.id}/edit`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}