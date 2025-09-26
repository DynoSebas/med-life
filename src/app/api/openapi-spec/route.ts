import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as yaml from 'js-yaml'

export async function GET(request: NextRequest) {
  try {
    // Leer el archivo OpenAPI YAML
    const specPath = join(process.cwd(), 'docs', 'openapi.yaml')
    const yamlContent = readFileSync(specPath, 'utf-8')
    
    // Convertir YAML a JSON
    const spec = yaml.load(yamlContent) as any
    
    // Actualizar la URL del servidor basándose en el request
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = `${protocol}://${host}/api`
    
    // Actualizar los servidores en la especificación
    spec.servers = [
      {
        url: baseUrl,
        description: 'Servidor actual'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo'
      },
      {
        url: 'https://med-life.vercel.app/api',
        description: 'Servidor de producción'
      }
    ]
    
    return NextResponse.json(spec, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
      }
    })
    
  } catch (error) {
    console.error('Error loading OpenAPI spec:', error)
    return NextResponse.json(
      { 
        error: 'Failed to load OpenAPI specification',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}