'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Stethoscope,
  FileText,
  Activity,
  Pill
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Patient, User } from '@/lib/types/database'

interface ConsultationForm {
  patient_id: string
  doctor_id?: string
  consultation_date: string
  consultation_time?: string
  soap_subjective?: string
  soap_objective?: string
  soap_assessment?: string
  soap_plan?: string
  diagnoses_cie10: string[]
  height_cm?: number
  weight_kg?: number
  bmi?: number
  blood_pressure?: string
  heart_rate?: number
  respiratory_rate?: number
  temperature?: number
  oxygen_saturation?: number
  prescribed_medications: Medication[]
  requested_studies: MedicalStudy[]
  next_appointment_suggested?: string
  follow_up_notes?: string
  private_notes?: string
  status: 'draft' | 'completed' | 'cancelled'
}

interface Medication {
  drug: string
  dose: string
  frequency: string
  duration?: string
  notes?: string
}

interface MedicalStudy {
  type: string
  description: string
  urgent?: boolean
  notes?: string
}

export default function NewConsultationPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string
  const { toast } = useToast()

  const [patient, setPatient] = useState<Patient | null>(null)
  const [doctors, setDoctors] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ConsultationForm>({
    patient_id: patientId,
    consultation_date: new Date().toISOString().split('T')[0],
    consultation_time: new Date().toTimeString().slice(0, 5),
    diagnoses_cie10: [],
    prescribed_medications: [],
    requested_studies: [],
    status: 'completed'
  })

  // Funciones para manejar medicamentos
  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      prescribed_medications: [
        ...prev.prescribed_medications,
        { drug: '', dose: '', frequency: '', duration: '', notes: '' }
      ]
    }))
  }

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prescribed_medications: prev.prescribed_medications.filter((_, i) => i !== index)
    }))
  }

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    setFormData(prev => ({
      ...prev,
      prescribed_medications: prev.prescribed_medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }))
  }

  // Funciones para manejar estudios
  const addStudy = () => {
    setFormData(prev => ({
      ...prev,
      requested_studies: [
        ...prev.requested_studies,
        { type: '', description: '', urgent: false, notes: '' }
      ]
    }))
  }

  const removeStudy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requested_studies: prev.requested_studies.filter((_, i) => i !== index)
    }))
  }

  const updateStudy = (index: number, field: keyof MedicalStudy, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      requested_studies: prev.requested_studies.map((study, i) => 
        i === index ? { ...study, [field]: value } : study
      )
    }))
  }

  // Funciones para manejar diagnósticos
  const addDiagnosis = (diagnosis: string) => {
    if (!diagnosis.trim()) return
    if (!formData.diagnoses_cie10.includes(diagnosis)) {
      setFormData(prev => ({
        ...prev,
        diagnoses_cie10: [...prev.diagnoses_cie10, diagnosis]
      }))
    }
  }

  const removeDiagnosis = (index: number) => {
    setFormData(prev => ({
      ...prev,
      diagnoses_cie10: prev.diagnoses_cie10.filter((_, i) => i !== index)
    }))
  }

  // Calcular BMI automáticamente
  const calculateBMI = () => {
    if (formData.weight_kg && formData.height_cm) {
      const heightInMeters = formData.height_cm / 100
      const bmi = formData.weight_kg / (heightInMeters * heightInMeters)
      setFormData(prev => ({
        ...prev,
        bmi: Number(bmi.toFixed(1))
      }))
    }
  }

  useEffect(() => {
    calculateBMI()
  }, [formData.weight_kg, formData.height_cm])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos del paciente
        const patientResponse = await fetch(`/api/patients/${patientId}`)
        if (patientResponse.ok) {
          const patientData = await patientResponse.json()
          setPatient(patientData.patient)
        }

        // Obtener lista de doctores
        const doctorsResponse = await fetch('/api/users?role=medico')
        if (doctorsResponse.ok) {
          const doctorsData = await doctorsResponse.json()
          setDoctors(doctorsData.users || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          title: "Error",
          description: "Error al cargar los datos iniciales",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [patientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSubmitting(true)
      
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al crear la consulta')
      }

      const result = await response.json()
      
      toast({
        title: "Éxito",
        description: "Consulta creada exitosamente",
      })

      router.push(`/patients/${patientId}/consultations`)
    } catch (error) {
      console.error('Error creating consultation:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear la consulta",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nueva Consulta</h1>
          <p className="text-muted-foreground">
            {patient?.first_name} {patient?.last_name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información General */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="consultation_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha de Consulta</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="consultation_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="doctor_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar doctor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              Dr. {doctor.first_name} {doctor.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="completed">Completada</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Signos Vitales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Signos Vitales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight_kg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Peso (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="70.5"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="height_cm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Altura (cm)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="170"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IMC</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1"
                          readOnly
                          placeholder="Calculado automáticamente"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Se calcula automáticamente con peso y altura
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="blood_pressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Presión Arterial</FormLabel>
                        <FormControl>
                          <Input placeholder="120/80" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="heart_rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frecuencia Cardíaca</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="72"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperatura (°C)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            placeholder="36.5"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="oxygen_saturation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Saturación O2 (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="98"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notas SOAP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Notas SOAP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="soap_subjective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subjetivo (S)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Síntomas reportados por el paciente..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Lo que dice el paciente
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="soap_objective"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo (O)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Exploración física, signos vitales..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Observaciones médicas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="soap_assessment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Análisis (A)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Evaluación médica, diagnóstico..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Evaluación y diagnóstico
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="soap_plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan (P)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Plan de tratamiento, seguimiento..."
                          className="min-h-24"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Plan de tratamiento
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Diagnósticos CIE-10 */}
          <Card>
            <CardHeader>
              <CardTitle>Diagnósticos CIE-10</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Escribir diagnóstico CIE-10..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addDiagnosis((e.target as HTMLInputElement).value)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }}
                />
                <Button 
                  type="button"
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).parentElement?.querySelector('input')
                    if (input) {
                      addDiagnosis(input.value)
                      input.value = ''
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {watch('diagnoses_cie10')?.map((diagnosis, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {diagnosis}
                    <button
                      type="button"
                      onClick={() => removeDiagnosis(index)}
                      className="ml-1 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>Guardando...</>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Consulta
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}