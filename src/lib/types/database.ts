// Database types for Med-Life application
export type UserRole = 'admin' | 'medico' | 'recepcion'
export type AppointmentStatus = 'programada' | 'confirmada' | 'atendida' | 'cancelada' | 'no_show'
export type ServiceChannel = 'presencial' | 'telemedicina' | 'ambos'
export type CampaignStatus = 'activa' | 'pausada' | 'finalizada'
export type CampaignChannel = 'email' | 'sms' | 'ambos'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: UserRole
          phone: string | null
          avatar_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          role?: UserRole
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          role?: UserRole
          phone?: string | null
          avatar_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          first_name: string
          last_name: string
          date_of_birth: string
          phone: string | null
          email: string | null
          address: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          tags: string[] | null
          notes: string | null
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          date_of_birth: string
          phone?: string | null
          email?: string | null
          address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          tags?: string[] | null
          notes?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          date_of_birth?: string
          phone?: string | null
          email?: string | null
          address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          tags?: string[] | null
          notes?: string | null
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          duration_minutes: number
          base_price: number
          channel: ServiceChannel
          color: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration_minutes?: number
          base_price?: number
          channel?: ServiceChannel
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration_minutes?: number
          base_price?: number
          channel?: ServiceChannel
          color?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          service_id: string
          start_time: string
          end_time: string
          status: AppointmentStatus
          duration_minutes: number
          price: number
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          service_id: string
          start_time: string
          end_time: string
          status?: AppointmentStatus
          duration_minutes: number
          price: number
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          service_id?: string
          start_time?: string
          end_time?: string
          status?: AppointmentStatus
          duration_minutes?: number
          price?: number
          notes?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medical_records: {
        Row: {
          id: string
          patient_id: string
          appointment_id: string | null
          doctor_id: string
          allergies: string | null
          chronic_diseases: string | null
          surgeries: string | null
          current_medications: string | null
          habits: string | null
          gynecological_history: string | null
          subjective: string | null
          objective: string | null
          assessment: string | null
          plan: string | null
          blood_pressure_systolic: number | null
          blood_pressure_diastolic: number | null
          heart_rate: number | null
          weight: number | null
          height: number | null
          temperature: number | null
          diagnoses: any | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          appointment_id?: string | null
          doctor_id: string
          allergies?: string | null
          chronic_diseases?: string | null
          surgeries?: string | null
          current_medications?: string | null
          habits?: string | null
          gynecological_history?: string | null
          subjective?: string | null
          objective?: string | null
          assessment?: string | null
          plan?: string | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          heart_rate?: number | null
          weight?: number | null
          height?: number | null
          temperature?: number | null
          diagnoses?: any | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['medical_records']['Insert']>
      }
      campaigns: {
        Row: {
          id: string
          title: string
          message: string
          channel: CampaignChannel
          status: CampaignStatus
          target_age_min: number | null
          target_age_max: number | null
          target_gender: string | null
          target_inactive_days: number | null
          target_service_ids: string[] | null
          schedule_type: string | null
          schedule_date: string | null
          schedule_month: number | null
          schedule_day: number | null
          total_sent: number
          total_delivered: number
          total_opened: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          channel?: CampaignChannel
          status?: CampaignStatus
          target_age_min?: number | null
          target_age_max?: number | null
          target_gender?: string | null
          target_inactive_days?: number | null
          target_service_ids?: string[] | null
          schedule_type?: string | null
          schedule_date?: string | null
          schedule_month?: number | null
          schedule_day?: number | null
          total_sent?: number
          total_delivered?: number
          total_opened?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['campaigns']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
      appointment_status: AppointmentStatus
      service_channel: ServiceChannel
      campaign_status: CampaignStatus
      campaign_channel: CampaignChannel
    }
  }
}

// Utility types
export type User = Database['public']['Tables']['users']['Row']
export type Patient = Database['public']['Tables']['patients']['Row']
export type Service = Database['public']['Tables']['services']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']
export type MedicalRecord = Database['public']['Tables']['medical_records']['Row']
export type Campaign = Database['public']['Tables']['campaigns']['Row']

// Extended types with relations
export type AppointmentWithRelations = Appointment & {
  patient: Patient
  doctor: User
  service: Service
}

export type PatientWithStats = Patient & {
  last_appointment?: string
  next_appointment?: string
  total_appointments: number
  alerts?: string[]
}

export type MedicalRecordWithRelations = MedicalRecord & {
  patient: Patient
  doctor: User
  appointment?: Appointment
}