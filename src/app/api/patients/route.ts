import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('patients')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`)
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()

    // Extraer todos los campos del paciente
    const patientData = {
      first_name: body.patient.first_name,
      last_name: body.patient.last_name,
      date_of_birth: body.patient.date_of_birth,
      sex: body.patient.sex || null,
      phone: body.patient.phone || null,
      email: body.patient.email || null,
      address: body.patient.address_json?.calle || null,
      city: body.patient.address_json?.ciudad || null,
      postal_code: body.patient.address_json?.cp || null,
      emergency_contact_name: body.patient.emergency_contact_json?.nombre || null,
      emergency_contact_phone: body.patient.emergency_contact_json?.telefono || null,
      emergency_contact_relation: body.patient.emergency_contact_json?.relacion || null,
      
      // Historia médica
      allergies: body.medical_record?.allergies || [],
      chronic_conditions: body.medical_record?.chronic_conditions || [],
      current_medications: body.medical_record?.meds_current || [],
      previous_surgeries: body.medical_record?.surgeries || [],
      family_history: body.medical_record?.family_history || {},
      
      // Estilo de vida
      smoking_status: body.medical_record?.lifestyle?.tabaquismo || null,
      alcohol_consumption: body.medical_record?.lifestyle?.alcohol || null,
      physical_activity: body.medical_record?.lifestyle?.actividad || null,
      sleep_habits: body.medical_record?.lifestyle?.sueno || null,
      diet_habits: body.medical_record?.lifestyle?.dieta || null,
      
      // Signos vitales
      height_cm: body.medical_record?.vitals_last?.height_cm || null,
      weight_kg: body.medical_record?.vitals_last?.weight_kg || null,
      bmi: body.medical_record?.vitals_last?.bmi || null,
      blood_pressure: body.medical_record?.vitals_last?.bp || null,
      heart_rate: body.medical_record?.vitals_last?.hr || null,
      respiratory_rate: body.medical_record?.vitals_last?.rr || null,
      temperature: body.medical_record?.vitals_last?.temp || null,
      oxygen_saturation: body.medical_record?.vitals_last?.spo2 || null,
      
      // Notas SOAP
      soap_subjective: body.encounter?.notes_soap?.S || null,
      soap_objective: body.encounter?.notes_soap?.O || null,
      soap_assessment: body.encounter?.notes_soap?.A || null,
      soap_plan: body.encounter?.notes_soap?.P || null,
      
      // Diagnósticos
      diagnoses_cie10: body.encounter?.dx_codes || [],
      
      tags: body.patient.tags || [],
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Crear el paciente primero
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single()

    if (patientError) {
      console.error('Error creating patient:', patientError)
      return NextResponse.json({ error: patientError.message }, { status: 400 })
    }

    // Crear el medical record si hay datos
    if (body.medical_record && patient.id) {
      const medicalRecordData = {
        patient_id: patient.id,
        ...body.medical_record,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const { error: recordError } = await supabase
        .from('medical_records')
        .insert([medicalRecordData])

      if (recordError) {
        console.error('Error creating medical record:', recordError)
        // No fallar aquí, solo loguear
      }
    }

    // Crear encounter si hay datos
    if (body.encounter && patient.id) {
      const encounterData = {
        patient_id: patient.id,
        ...body.encounter,
        encounter_date: new Date().toISOString(),
        created_at: new Date().toISOString()
      }

      const { error: encounterError } = await supabase
        .from('encounters')
        .insert([encounterData])

      if (encounterError) {
        console.error('Error creating encounter:', encounterError)
        // No fallar aquí, solo loguear
      }
    }

    return NextResponse.json({ patient }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}