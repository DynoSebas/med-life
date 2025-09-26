import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServiceClient()
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID del paciente es requerido' },
        { status: 400 }
      )
    }

    const { data: patient, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching patient:', error)
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServiceClient()
    const { id } = await params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'ID del paciente es requerido' },
        { status: 400 }
      )
    }

    // Actualizar todos los campos del paciente
    const patientData = {
      first_name: body.patient?.first_name || body.first_name,
      last_name: body.patient?.last_name || body.last_name,
      date_of_birth: body.patient?.date_of_birth || body.date_of_birth,
      sex: body.patient?.sex || body.sex || null,
      phone: body.patient?.phone || body.phone || null,
      email: body.patient?.email || body.email || null,
      address: body.patient?.address_json?.calle || body.address || null,
      city: body.patient?.address_json?.ciudad || body.city || null,
      postal_code: body.patient?.address_json?.cp || body.postal_code || null,
      emergency_contact_name: body.patient?.emergency_contact_json?.nombre || body.emergency_contact_name || null,
      emergency_contact_phone: body.patient?.emergency_contact_json?.telefono || body.emergency_contact_phone || null,
      emergency_contact_relation: body.patient?.emergency_contact_json?.relacion || body.emergency_contact_relation || null,
      
      // Historia médica
      allergies: body.medical_record?.allergies || body.allergies || null,
      chronic_conditions: body.medical_record?.chronic_conditions || body.chronic_conditions || null,
      current_medications: body.medical_record?.meds_current || body.current_medications || null,
      previous_surgeries: body.medical_record?.surgeries || body.previous_surgeries || null,
      family_history: body.medical_record?.family_history || body.family_history || null,
      
      // Estilo de vida
      smoking_status: body.medical_record?.lifestyle?.tabaquismo || body.smoking_status || null,
      alcohol_consumption: body.medical_record?.lifestyle?.alcohol || body.alcohol_consumption || null,
      physical_activity: body.medical_record?.lifestyle?.actividad || body.physical_activity || null,
      sleep_habits: body.medical_record?.lifestyle?.sueno || body.sleep_habits || null,
      diet_habits: body.medical_record?.lifestyle?.dieta || body.diet_habits || null,
      
      // Signos vitales
      height_cm: body.medical_record?.vitals_last?.height_cm || body.height_cm || null,
      weight_kg: body.medical_record?.vitals_last?.weight_kg || body.weight_kg || null,
      bmi: body.medical_record?.vitals_last?.bmi || body.bmi || null,
      blood_pressure: body.medical_record?.vitals_last?.bp || body.blood_pressure || null,
      heart_rate: body.medical_record?.vitals_last?.hr || body.heart_rate || null,
      respiratory_rate: body.medical_record?.vitals_last?.rr || body.respiratory_rate || null,
      temperature: body.medical_record?.vitals_last?.temp || body.temperature || null,
      oxygen_saturation: body.medical_record?.vitals_last?.spo2 || body.oxygen_saturation || null,
      
      // Notas SOAP
      soap_subjective: body.encounter?.notes_soap?.S || body.soap_subjective || null,
      soap_objective: body.encounter?.notes_soap?.O || body.soap_objective || null,
      soap_assessment: body.encounter?.notes_soap?.A || body.soap_assessment || null,
      soap_plan: body.encounter?.notes_soap?.P || body.soap_plan || null,
      
      // Diagnósticos
      diagnoses_cie10: body.encounter?.dx_codes || body.diagnoses_cie10 || null,
      
      tags: body.patient?.tags || body.tags || null,
      updated_at: new Date().toISOString()
    }

    const { data: patient, error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('id', id)
      .eq('is_active', true)
      .select()
      .single()

    if (error) {
      console.error('Error updating patient:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createServiceClient()
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'ID del paciente es requerido' },
        { status: 400 }
      )
    }

    // Soft delete - solo marcar como inactivo
    const { data: patient, error } = await supabase
      .from('patients')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error deleting patient:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ message: 'Paciente eliminado exitosamente' })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}