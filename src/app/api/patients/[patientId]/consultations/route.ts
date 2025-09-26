import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface RouteParams {
  params: Promise<{ patientId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { patientId } = await params
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1
    const status = searchParams.get('status')

    // Verificar que el paciente existe
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, first_name, last_name')
      .eq('id', patientId)
      .single()

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      )
    }

    let query = supabase
      .from('consultations_with_details')
      .select('*')
      .eq('patient_id', patientId)

    if (status) {
      query = query.eq('status', status)
    }

    // Paginación
    const offset = (page - 1) * limit
    query = query
      .order('consultation_date', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: consultations, error } = await query

    if (error) {
      console.error('Error fetching patient consultations:', error)
      return NextResponse.json(
        { error: 'Error al obtener las consultas del paciente' },
        { status: 500 }
      )
    }

    // Obtener total de consultas del paciente
    const { count: totalCount } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patientId)

    // Obtener estadísticas rápidas
    const { data: stats } = await supabase
      .from('consultations')
      .select('status, consultation_date')
      .eq('patient_id', patientId)

    const consultationStats = {
      total: totalCount || 0,
      this_month: stats?.filter(c => {
        const consultationDate = new Date(c.consultation_date)
        const now = new Date()
        return consultationDate.getMonth() === now.getMonth() && 
               consultationDate.getFullYear() === now.getFullYear()
      }).length || 0,
      by_status: {
        completed: stats?.filter(c => c.status === 'completed').length || 0,
        draft: stats?.filter(c => c.status === 'draft').length || 0,
        cancelled: stats?.filter(c => c.status === 'cancelled').length || 0
      }
    }

    return NextResponse.json({
      patient,
      consultations,
      stats: consultationStats,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }
    })

  } catch (error) {
    console.error('Unexpected error in GET /api/patients/[patientId]/consultations:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}