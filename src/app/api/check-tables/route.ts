import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing Supabase connection with direct table queries...')
    
    const supabase = createServiceClient()
    
    const results = {
      connection: true,
      tables: {} as Record<string, { exists: boolean; count?: number; error?: string; code?: string; details?: any }>,
      errors: [] as string[]
    }
    
    // Test each table individually
    const tablesToTest = ['patients', 'services', 'appointments', 'users']
    
    for (const tableName of tablesToTest) {
      console.log(`Testing table: ${tableName}`)
      
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true })
        
        if (error) {
          results.tables[tableName] = {
            exists: false,
            error: error.message,
            code: error.code
          }
          results.errors.push(`${tableName}: ${error.message}`)
        } else {
          results.tables[tableName] = {
            exists: true,
            count: count || 0
          }
        }
      } catch (err) {
        results.tables[tableName] = {
          exists: false,
          error: 'Unexpected error',
          details: err
        }
        results.errors.push(`${tableName}: Unexpected error`)
      }
    }
    
    // Determine overall status
    const existingTables = Object.keys(results.tables).filter(
      table => results.tables[table].exists
    )
    
    const tablesStatus = existingTables.length === 0 
      ? 'No tables exist - schema needs to be created'
      : `${existingTables.length}/${tablesToTest.length} tables exist`
    
    return NextResponse.json({
      success: true,
      status: tablesStatus,
      existingTables,
      missingTables: tablesToTest.filter(table => !results.tables[table].exists),
      details: results.tables,
      errors: results.errors,
      recommendation: existingTables.length === 0 
        ? 'Execute database schema to create tables'
        : 'Some tables are missing, check schema execution',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('💥 Connection test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Connection test failed',
      details: error
    }, { status: 500 })
  }
}