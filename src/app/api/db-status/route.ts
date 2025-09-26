import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    
    // Get all tables in the public schema
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name')
    
    if (error) {
      return NextResponse.json({
        error: 'Failed to get tables',
        details: error
      }, { status: 500 })
    }
    
    // Get row counts for each table
    const tableCounts: Record<string, number> = {}
    
    if (tables) {
      for (const table of tables) {
        const tableName = table.table_name
        try {
          const { count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })
          
          tableCounts[tableName] = count || 0
        } catch (err) {
          tableCounts[tableName] = -1 // Error getting count
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      tables: tables?.map(t => t.table_name) || [],
      tableCounts,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error
    }, { status: 500 })
  }
}