import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    
    // Read the schema file
    const schemaPath = join(process.cwd(), 'database', 'schema.sql')
    const schemaSQL = readFileSync(schemaPath, 'utf-8')
    
    console.log('📄 Executing database schema...')
    
    // Execute the schema
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: schemaSQL
    })
    
    if (error) {
      console.error('❌ Schema execution failed:', error)
      
      // Try executing parts of the schema manually
      const statements = schemaSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))
      
      const results = []
      let successCount = 0
      let errorCount = 0
      
      for (const statement of statements.slice(0, 10)) { // Execute first 10 statements
        try {
          const { error: stmtError } = await supabase.rpc('exec_sql', {
            sql_query: statement
          })
          
          if (stmtError) {
            results.push({
              statement: statement.substring(0, 100) + '...',
              success: false,
              error: stmtError.message
            })
            errorCount++
          } else {
            results.push({
              statement: statement.substring(0, 100) + '...',
              success: true
            })
            successCount++
          }
        } catch (err) {
          results.push({
            statement: statement.substring(0, 100) + '...',
            success: false,
            error: 'Execution error'
          })
          errorCount++
        }
      }
      
      return NextResponse.json({
        success: false,
        message: 'Schema execution had errors, tried individual statements',
        results,
        summary: {
          successCount,
          errorCount,
          totalAttempted: results.length
        }
      })
    }
    
    console.log('✅ Schema executed successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Database schema executed successfully',
      data
    })
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to execute schema',
      details: error
    }, { status: 500 })
  }
}