"use client"

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { NewPatientHeader } from '@/components/patients/NewPatientHeader'
import { IdentificationCard } from '@/components/forms/IdentificationCard'
import { HistoryCard } from '@/components/forms/HistoryCard'
import { GynObCard } from '@/components/forms/GynObCard'
import { VitalsCard } from '@/components/forms/VitalsCard'
import { SoapCard } from '@/components/forms/SoapCard'
import { DxCIE10Card } from '@/components/forms/DxCIE10Card'
import { PrivacyCard } from '@/components/forms/PrivacyCard'
import { AllergyFlag } from '@/components/common/AllergyFlag'
import { ScrollSpy } from '@/components/common/ScrollSpy'

interface PatientFormData {
  patient: {
    first_name: string
    last_name: string
    sex: 'M' | 'F' | 'X' | ''
    date_of_birth: string
    phone: string
    email: string
    address_json: {
      calle: string
      ciudad: string
      cp: string
    }
    emergency_contact_json: {
      nombre: string
      relacion: string
      telefono: string
    }
    tags: string[]
  }
  medical_record: {
    allergies: string[]
    chronic_conditions: string[]
    meds_current: Array<{
      drug: string
      dose: string
      frequency: string
      notes?: string
    }>
    surgeries: string[]
    family_history: Record<string, string>
    lifestyle: {
      tabaquismo: string
      alcohol: string
      actividad: string
      sueno: string
      dieta: string
    }
    gyn_ob?: {
      menarca?: string
      fum?: string
      ciclo?: string
      gesta?: number
      para?: number
      abortos?: number
      metodo_anticonceptivo?: string
    }
    vitals_last: {
      height_cm?: number
      weight_kg?: number
      bmi?: number
      bp?: string
      hr?: number
      rr?: number
      temp?: number
      spo2?: number
    }
  }
  encounter: {
    notes_soap: {
      S: string
      O: string
      A: string
      P: string
    }
    dx_codes: string[]
  }
  consent: boolean
}

const initialFormData: PatientFormData = {
  patient: {
    first_name: '',
    last_name: '',
    sex: '',
    date_of_birth: '',
    phone: '',
    email: '',
    address_json: {
      calle: '',
      ciudad: '',
      cp: ''
    },
    emergency_contact_json: {
      nombre: '',
      relacion: '',
      telefono: ''
    },
    tags: []
  },
  medical_record: {
    allergies: [],
    chronic_conditions: [],
    meds_current: [],
    surgeries: [],
    family_history: {},
    lifestyle: {
      tabaquismo: '',
      alcohol: '',
      actividad: '',
      sueno: '',
      dieta: ''
    },
    vitals_last: {}
  },
  encounter: {
    notes_soap: {
      S: '',
      O: '',
      A: '',
      P: ''
    },
    dx_codes: []
  },
  consent: false
}

export default function NewPatientPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<PatientFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const updateFormData = useCallback((section: keyof PatientFormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }))
    
    // Limpiar errores relacionados con esta sección cuando el usuario hace cambios
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors }
      
      // Limpiar errores específicos de la sección que se está editando
      if (section === 'patient') {
        delete newErrors['patient.first_name']
        delete newErrors['patient.last_name']
        delete newErrors['patient.date_of_birth']
        delete newErrors['patient.sex']
        delete newErrors['patient.phone']
        delete newErrors['patient.email']
        delete newErrors['patient.contact']
      } else if (section === 'consent') {
        delete newErrors['consent']
      }
      
      return newErrors
    })
  }, [])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Solo campos obligatorios básicos
    if (!formData.patient.first_name.trim()) {
      newErrors['patient.first_name'] = 'El nombre es obligatorio'
    }
    if (!formData.patient.last_name.trim()) {
      newErrors['patient.last_name'] = 'Los apellidos son obligatorios'
    }
    if (!formData.patient.date_of_birth) {
      newErrors['patient.date_of_birth'] = 'La fecha de nacimiento es obligatoria'
    }
    if (!formData.patient.sex) {
      newErrors['patient.sex'] = 'El sexo es obligatorio'
    }

    // Validaciones de formato
    if (formData.patient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.patient.email)) {
      newErrors['patient.email'] = 'Email inválido'
    }
    if (formData.patient.phone && !/^\d{10}$/.test(formData.patient.phone.replace(/\s|-/g, ''))) {
      newErrors['patient.phone'] = 'Teléfono debe tener 10 dígitos'
    }

    // Validación de edad
    if (formData.patient.date_of_birth) {
      const birthDate = new Date(formData.patient.date_of_birth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 0 || age > 120) {
        newErrors['patient.date_of_birth'] = 'Edad debe estar entre 0 y 120 años'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({}) // Limpiar errores previos
    
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (!response.ok) {
        // Mostrar error específico del servidor
        if (result.error) {
          setErrors({ general: `Error: ${result.error}` })
        } else {
          setErrors({ general: `Error del servidor (${response.status}): ${response.statusText}` })
        }
        return
      }

      // Éxito - redirigir
      router.push(`/patients/${result.patient.id}`)
    } catch (error) {
      console.error('Error de red:', error)
      setErrors({ 
        general: 'Error de conexión. Verifique su conexión a internet e intente nuevamente.' 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/patients')
  }

  const clearError = useCallback((errorKey: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[errorKey]
      return newErrors
    })
  }, [])

  const hasAllergies = formData.medical_record.allergies.length > 0

  const sections = [
    { id: 'identification', title: 'Identificación' },
    { id: 'history', title: 'Antecedentes' },
    ...(formData.patient.sex === 'F' ? [{ id: 'gynob', title: 'Gineco-obstétricos' }] : []),
    { id: 'vitals', title: 'Signos vitales' },
    { id: 'soap', title: 'Nota clínica' },
    { id: 'diagnosis', title: 'Diagnósticos' },
    { id: 'privacy', title: 'Privacidad' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Sticky */}
      <NewPatientHeader
        onSave={handleSave}
        onCancel={handleCancel}
        hasAllergies={hasAllergies}
        isLoading={isLoading}
        errors={errors}
        onClearError={clearError}
      />

      <div className="flex">
        {/* Contenido Principal */}
        <div className="flex-1 px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Card Identificación */}
            <div id="identification">
              <IdentificationCard
                data={formData.patient}
                onChange={(data) => updateFormData('patient', data)}
                errors={errors}
              />
            </div>

            {/* Card Antecedentes */}
            <div id="history">
              <HistoryCard
                data={formData.medical_record}
                onChange={(data) => updateFormData('medical_record', { 
                  ...formData.medical_record, ...data 
                })}
                errors={errors}
              />
            </div>

            {/* Card Gineco-obstétricos (condicional) */}
            {formData.patient.sex === 'F' && (
              <div id="gynob">
                <GynObCard
                  data={formData.medical_record.gyn_ob || {}}
                  onChange={(data) => updateFormData('medical_record', { gyn_ob: data })}
                  errors={errors}
                />
              </div>
            )}

            {/* Card Signos Vitales */}
            <div id="vitals">
              <VitalsCard
                data={formData.medical_record.vitals_last}
                onChange={(data) => updateFormData('medical_record', { 
                  vitals_last: { ...formData.medical_record.vitals_last, ...data }
                })}
                errors={errors}
              />
            </div>

            {/* Card Nota Clínica SOAP */}
            <div id="soap">
              <SoapCard
                data={formData.encounter.notes_soap}
                onChange={(data) => updateFormData('encounter', { notes_soap: data })}
                errors={errors}
              />
            </div>

            {/* Card Diagnósticos */}
            <div id="diagnosis">
              <DxCIE10Card
                data={formData.encounter.dx_codes}
                onChange={(data) => updateFormData('encounter', { dx_codes: data })}
                errors={errors}
              />
            </div>

            {/* Card Privacidad */}
            <div id="privacy">
              <PrivacyCard
                data={{ consent: formData.consent }}
                onChange={(data) => {
                  if (data.consent !== undefined) {
                    setFormData(prev => ({ ...prev, consent: data.consent }))
                  }
                }}
                errors={errors}
              />
            </div>
          </div>
        </div>

        {/* ScrollSpy Sidebar */}
        <div className="hidden lg:block w-64 px-6 py-8">
          <ScrollSpy sections={sections} />
        </div>
      </div>
    </div>
  )
}