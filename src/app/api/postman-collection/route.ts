import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import * as yaml from 'js-yaml'

export async function GET(request: NextRequest) {
  try {
    // Leer el archivo OpenAPI YAML
    const specPath = join(process.cwd(), 'docs', 'openapi.yaml')
    const yamlContent = readFileSync(specPath, 'utf-8')
    const spec = yaml.load(yamlContent) as any
    
    // Obtener la URL base del servidor actual
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = `${protocol}://${host}/api`
    
    // Crear la colección de Postman
    const postmanCollection = {
      info: {
        name: spec.info.title,
        description: spec.info.description,
        version: spec.info.version,
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
      },
      variable: [
        {
          key: "baseUrl",
          value: baseUrl,
          type: "string"
        }
      ],
      item: [] as any[]
    }
    
    // Convertir cada path a items de Postman
    const items: any[] = []
    
    for (const [path, methods] of Object.entries(spec.paths)) {
      const folderName = path.split('/')[1] || 'Root'
      let folder = items.find(item => item.name === folderName.charAt(0).toUpperCase() + folderName.slice(1))
      
      if (!folder) {
        folder = {
          name: folderName.charAt(0).toUpperCase() + folderName.slice(1),
          item: []
        }
        items.push(folder)
      }
      
      for (const [method, operation] of Object.entries(methods as any)) {
        const op = operation as any
        const request: any = {
          name: op.summary || `${method.toUpperCase()} ${path}`,
          request: {
            method: method.toUpperCase(),
            header: [
              {
                key: "Content-Type",
                value: "application/json",
                type: "text"
              }
            ],
            url: {
              raw: `{{baseUrl}}${path}`,
              host: ["{{baseUrl}}"],
              path: path.split('/').filter(Boolean)
            }
          }
        }
        
        // Agregar parámetros de query si existen
        if (op.parameters) {
          const queryParams = op.parameters
            .filter((param: any) => param.in === 'query')
            .map((param: any) => ({
              key: param.name,
              value: param.schema?.example || "",
              description: param.description,
              disabled: !param.required
            }))
          
          if (queryParams.length > 0) {
            request.request.url.query = queryParams
          }
        }
        
        // Agregar body para métodos POST/PUT
        if (['post', 'put', 'patch'].includes(method) && op.requestBody) {
          const schema = op.requestBody.content?.['application/json']?.schema
          if (schema) {
            const exampleBody = createExampleFromSchema(schema)
            request.request.body = {
              mode: "raw",
              raw: JSON.stringify(exampleBody, null, 2),
              options: {
                raw: {
                  language: "json"
                }
              }
            }
          }
        }
        
        // Agregar descripción
        if (op.description) {
          request.description = op.description
        }
        
        folder.item.push(request)
      }
    }
    
    postmanCollection.item = items
    
    return NextResponse.json(postmanCollection, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="med-life-api.postman_collection.json"'
      }
    })
    
  } catch (error) {
    console.error('Error generating Postman collection:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate Postman collection',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    )
  }
}

function createExampleFromSchema(schema: any): any {
  if (schema.type === 'object' && schema.properties) {
    const example: any = {}
    for (const [key, prop] of Object.entries(schema.properties)) {
      const propSchema = prop as any
      if (propSchema.example !== undefined) {
        example[key] = propSchema.example
      } else {
        switch (propSchema.type) {
          case 'string':
            if (propSchema.format === 'email') {
              example[key] = 'user@example.com'
            } else if (propSchema.format === 'date') {
              example[key] = '2025-09-26'
            } else if (propSchema.format === 'time') {
              example[key] = '14:30:00'
            } else if (propSchema.format === 'uuid') {
              example[key] = '123e4567-e89b-12d3-a456-426614174000'
            } else {
              example[key] = propSchema.example || 'string'
            }
            break
          case 'integer':
            example[key] = propSchema.example || 1
            break
          case 'number':
            example[key] = propSchema.example || 1.0
            break
          case 'boolean':
            example[key] = propSchema.example || true
            break
          case 'array':
            example[key] = propSchema.example || []
            break
          default:
            example[key] = propSchema.example || null
        }
      }
    }
    return example
  }
  return schema.example || null
}