import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing database connection...')
    
    const supabase = createServiceClient()
    
    // Test 1: Basic connection
    console.log('Test 1: Basic connection test')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })
    
    if (connectionError) {
      console.error('❌ Connection failed:', connectionError)
      return NextResponse.json({
        success: false,
        error: 'Connection failed',
        details: connectionError
      }, { status: 500 })
    }
    
    console.log('✅ Connection successful')
    
    // Test 2: Check if tables exist
    console.log('Test 2: Checking tables...')
    let tablesData = null
    let tablesError = null
    
    try {
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(5)
      
      tablesData = data
      tablesError = error
    } catch (err) {
      tablesError = err
    }
    
    // Test 3: Try to get patients
    console.log('Test 3: Getting patients data...')
    const { data: patients, error: patientsError, count } = await supabase
      .from('patients')
      .select('*', { count: 'exact' })
    
    if (patientsError) {
      console.error('❌ Patients query failed:', patientsError)
    } else {
      console.log(`✅ Found ${count} patients`)
    }
    
    // Test 4: Try to get services
    console.log('Test 4: Getting services data...')
    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select('*')
    
    if (servicesError) {
      console.error('❌ Services query failed:', servicesError)
    } else {
      console.log(`✅ Found ${services?.length || 0} services`)
    }
    
    return NextResponse.json({
      success: true,
      tests: {
        connection: !connectionError,
        patients: {
          success: !patientsError,
          count: count || 0,
          error: patientsError?.message || null,
          data: patients?.slice(0, 2) // Only first 2 for preview
        },
        services: {
          success: !servicesError,
          count: services?.length || 0,
          error: servicesError?.message || null,
          data: services?.slice(0, 2) // Only first 2 for preview
        }
      },
      timestamp: new Date().toISOString()
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