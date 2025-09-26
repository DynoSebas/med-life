import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing basic Supabase connection...')
    
    const supabase = createServiceClient()
    
    // Test 1: Very basic connection test - try to query system tables
    console.log('Test 1: Checking Supabase connection...')
    const { data: systemTest, error: systemError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1)
    
    if (systemError) {
      console.error('❌ System connection failed:', systemError)
      return NextResponse.json({
        success: false,
        step: 'system_connection',
        error: systemError.message,
        details: systemError
      }, { status: 500 })
    }
    
    console.log('✅ System connection successful')
    
    // Test 2: Check if our tables exist
    console.log('Test 2: Checking if our tables exist...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['patients', 'services', 'appointments', 'users'])
    
    if (tablesError) {
      console.error('❌ Tables check failed:', tablesError)
      return NextResponse.json({
        success: false,
        step: 'tables_check',
        error: tablesError.message,
        details: tablesError
      }, { status: 500 })
    }
    
    const existingTables = tables?.map(t => t.table_name) || []
    console.log('📋 Existing tables:', existingTables)
    
    // Test 3: Try to query patients table if it exists
    let patientsResult = null
    if (existingTables.includes('patients')) {
      console.log('Test 3: Querying patients table...')
      const { data: patients, error: patientsError, count } = await supabase
        .from('patients')
        .select('*', { count: 'exact' })
        .limit(5)
      
      patientsResult = {
        success: !patientsError,
        count: count || 0,
        error: patientsError?.message || null,
        sampleData: patients?.slice(0, 2) || []
      }
      
      if (patientsError) {
        console.error('❌ Patients query failed:', patientsError)
      } else {
        console.log(`✅ Found ${count} patients`)
      }
    } else {
      patientsResult = {
        success: false,
        error: 'patients table does not exist',
        count: 0
      }
    }
    
    return NextResponse.json({
      success: true,
      connection: 'successful',
      tables: {
        expected: ['patients', 'services', 'appointments', 'users'],
        existing: existingTables,
        missing: ['patients', 'services', 'appointments', 'users'].filter(t => !existingTables.includes(t))
      },
      patients: patientsResult,
      timestamp: new Date().toISOString(),
      recommendation: existingTables.length === 0 
        ? 'No tables found. Run database schema first.' 
        : `Found ${existingTables.length}/4 expected tables.`
    })
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return NextResponse.json({
      success: false,
      error: 'Unexpected error',
      details: error
    }, { status: 500 })
  }
}