import { z } from 'zod'

// Schema para medicamentos
export const medicationSchema = z.object({
  drug: z.string().min(1, 'El nombre del medicamento es requerido'),
  dose: z.string().min(1, 'La dosis es requerida'),
  frequency: z.string().min(1, 'La frecuencia es requerida'),
  duration: z.string().optional(),
  notes: z.string().optional()
})

// Schema para estudios médicos
export const medicalStudySchema = z.object({
  type: z.string().min(1, 'El tipo de estudio es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  urgent: z.boolean().optional().default(false),
  notes: z.string().optional()
})

// Schema para signos vitales
export const vitalSignsSchema = z.object({
  height_cm: z.number().min(30).max(300).optional(),
  weight_kg: z.number().min(0.5).max(500).optional(),
  bmi: z.number().min(10).max(100).optional(),
  blood_pressure: z.string().optional(),
  heart_rate: z.number().min(30).max(250).optional(),
  respiratory_rate: z.number().min(5).max(60).optional(),
  temperature: z.number().min(30).max(45).optional(),
  oxygen_saturation: z.number().min(50).max(100).optional()
})

// Schema para notas SOAP
export const soapNotesSchema = z.object({
  soap_subjective: z.string().optional(),
  soap_objective: z.string().optional(),
  soap_assessment: z.string().optional(),
  soap_plan: z.string().optional()
})

// Schema principal para crear/editar consulta
export const consultationSchema = z.object({
  patient_id: z.string().uuid('ID de paciente inválido'),
  doctor_id: z.string().uuid('ID de doctor inválido').optional(),
  consultation_date: z.string().min(1, 'La fecha de consulta es requerida'),
  consultation_time: z.string().optional(),
  
  // Notas SOAP
  soap_subjective: z.string().optional(),
  soap_objective: z.string().optional(),
  soap_assessment: z.string().optional(),
  soap_plan: z.string().optional(),
  
  // Diagnósticos
  diagnoses_cie10: z.array(z.string()).default([]),
  
  // Signos vitales
  height_cm: z.number().min(30).max(300).optional(),
  weight_kg: z.number().min(0.5).max(500).optional(),
  bmi: z.number().min(10).max(100).optional(),
  blood_pressure: z.string().optional(),
  heart_rate: z.number().min(30).max(250).optional(),
  respiratory_rate: z.number().min(5).max(60).optional(),
  temperature: z.number().min(30).max(45).optional(),
  oxygen_saturation: z.number().min(50).max(100).optional(),
  
  // Medicamentos y estudios
  prescribed_medications: z.array(medicationSchema).default([]),
  requested_studies: z.array(medicalStudySchema).default([]),
  
  // Seguimiento
  next_appointment_suggested: z.string().optional(),
  follow_up_notes: z.string().optional(),
  private_notes: z.string().optional(),
  
  // Estado
  status: z.enum(['draft', 'completed', 'cancelled']).default('completed')
})

export const consultationUpdateSchema = consultationSchema.partial().omit({ patient_id: true })

// Schema para filtros de búsqueda
export const consultationFiltersSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  doctor_id: z.string().uuid().optional(),
  status: z.enum(['draft', 'completed', 'cancelled']).optional(),
  has_diagnosis: z.boolean().optional(),
  search: z.string().optional()
})

export type ConsultationFormData = z.infer<typeof consultationSchema>
export type ConsultationUpdateData = z.infer<typeof consultationUpdateSchema>
export type ConsultationFiltersData = z.infer<typeof consultationFiltersSchema>