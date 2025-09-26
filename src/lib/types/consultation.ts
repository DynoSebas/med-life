// Types específicos para el módulo de Consultas Médicas

export interface Medication {
  drug: string
  dose: string
  frequency: string
  duration?: string
  notes?: string
}

export interface MedicalStudy {
  type: string
  description: string
  urgent?: boolean
  notes?: string
}

export interface SOAPNotes {
  subjective?: string    // (S) Lo que dice el paciente
  objective?: string     // (O) Exploración física
  assessment?: string    // (A) Evaluación/Diagnóstico
  plan?: string         // (P) Plan de tratamiento
}

export interface VitalSigns {
  height_cm?: number
  weight_kg?: number
  bmi?: number
  blood_pressure?: string
  heart_rate?: number
  respiratory_rate?: number
  temperature?: number
  oxygen_saturation?: number
}

export interface ConsultationForm extends SOAPNotes, VitalSigns {
  consultation_date: string
  consultation_time?: string
  diagnoses_cie10: string[]
  prescribed_medications: Medication[]
  requested_studies: MedicalStudy[]
  next_appointment_suggested?: string
  follow_up_notes?: string
  private_notes?: string
  status: 'draft' | 'completed' | 'cancelled'
}

export interface ConsultationListItem {
  id: string
  consultation_date: string
  doctor_name?: string
  diagnoses_count: number
  status: 'draft' | 'completed' | 'cancelled'
  main_diagnosis?: string
  has_follow_up: boolean
}

// Estados para la UI
export type ConsultationStatus = 'draft' | 'completed' | 'cancelled'

// Filtros para la lista de consultas
export interface ConsultationFilters {
  dateFrom?: string
  dateTo?: string
  doctor_id?: string
  status?: ConsultationStatus
  has_diagnosis?: boolean
  search?: string
}

// Para el selector de diagnósticos CIE-10
export interface CIE10Diagnosis {
  code: string
  description: string
  category?: string
}

// Para estadísticas rápidas
export interface ConsultationStats {
  total: number
  this_month: number
  pending_follow_up: number
  by_status: Record<ConsultationStatus, number>
}