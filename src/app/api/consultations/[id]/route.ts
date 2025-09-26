import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { consultationUpdateSchema } from '@/lib/schemas/consultation'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Obtener consulta con detalles del paciente y doctor
    const { data: consultation, error } = await supabase
      .from('consultations_with_details')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Consulta no encontrada' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching consultation:', error)
      return NextResponse.json(
        { error: 'Error al obtener la consulta' },
        { status: 500 }
      )
    }

    return NextResponse.json({ consultation })

  } catch (error) {
    console.error('Unexpected error in GET /api/consultations/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    // Validar datos de entrada
    const validatedData = consultationUpdateSchema.parse(body)

    // Verificar que la consulta existe
    const { data: existingConsultation, error: existingError } = await supabase
      .from('consultations')
      .select('id, patient_id')
      .eq('id', id)
      .single()

    if (existingError || !existingConsultation) {
      return NextResponse.json(
        { error: 'Consulta no encontrada' },
        { status: 404 }
      )
    }

    // Verificar que el doctor existe (si se proporciona)
    if (validatedData.doctor_id) {
      const { data: doctor, error: doctorError } = await supabase
        .from('users')
        .select('id')
        .eq('id', validatedData.doctor_id)
        .single()

      if (doctorError || !doctor) {
        return NextResponse.json(
          { error: 'Doctor no encontrado' },
          { status: 404 }
        )
      }
    }

    // Calcular BMI si se proporcionaron peso y altura
    if (validatedData.weight_kg && validatedData.height_cm) {
      const heightInMeters = validatedData.height_cm / 100
      validatedData.bmi = Number((validatedData.weight_kg / (heightInMeters * heightInMeters)).toFixed(1))
    }

    // Actualizar la consulta
    const { data: updatedConsultation, error } = await supabase
      .from('consultations')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating consultation:', error)
      return NextResponse.json(
        { error: 'Error al actualizar la consulta' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Consulta actualizada exitosamente',
      consultation: updatedConsultation
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Datos de entrada inválidos',
          details: error.issues
        },
        { status: 400 }
      )
    }

    console.error('Unexpected error in PUT /api/consultations/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Verificar que la consulta existe
    const { data: existingConsultation, error: existingError } = await supabase
      .from('consultations')
      .select('id')
      .eq('id', id)
      .single()

    if (existingError || !existingConsultation) {
      return NextResponse.json(
        { error: 'Consulta no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar la consulta
    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting consultation:', error)
      return NextResponse.json(
        { error: 'Error al eliminar la consulta' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Consulta eliminada exitosamente'
    })

  } catch (error) {
    console.error('Unexpected error in DELETE /api/consultations/[id]:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}