import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const doctor_id = searchParams.get('doctor_id')
    const patient_id = searchParams.get('patient_id')
    const date = searchParams.get('date')
    const status = searchParams.get('status')

    let query = supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*),
        doctor:users(*),
        service:services(*)
      `)
      .order('start_time', { ascending: true })

    if (doctor_id) {
      query = query.eq('doctor_id', doctor_id)
    }

    if (patient_id) {
      query = query.eq('patient_id', patient_id)
    }

    if (date) {
      const startOfDay = `${date}T00:00:00.000Z`
      const endOfDay = `${date}T23:59:59.999Z`
      query = query.gte('start_time', startOfDay).lte('start_time', endOfDay)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate appointment doesn't overlap
    const { data: existingAppointments, error: checkError } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', body.doctor_id)
      .neq('status', 'cancelada')
      .neq('status', 'no_show')
      .or(`start_time.lte.${body.start_time},end_time.gte.${body.end_time}`)

    if (checkError) {
      return NextResponse.json({ error: checkError.message }, { status: 400 })
    }

    // Check for overlaps
    const hasOverlap = existingAppointments?.some(apt => {
      const existingStart = new Date(apt.start_time)
      const existingEnd = new Date(apt.end_time)
      const newStart = new Date(body.start_time)
      const newEnd = new Date(body.end_time)

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      )
    })

    if (hasOverlap) {
      return NextResponse.json(
        { error: 'La cita se traslapa con otra cita existente' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([body])
      .select(`
        *,
        patient:patients(*),
        doctor:users(*),
        service:services(*)
      `)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}