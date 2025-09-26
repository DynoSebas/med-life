'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import 'swagger-ui-react/swagger-ui.css'

// Importación dinámica de SwaggerUI para evitar SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Cargar la especificación OpenAPI
    const loadSpec = async () => {
      try {
        const response = await fetch('/api/openapi-spec')
        if (!response.ok) {
          throw new Error('Failed to load API specification')
        }
        const specData = await response.json()
        setSpec(specData)
      } catch (err) {
        setError('Error loading API documentation')
        console.error('Error loading OpenAPI spec:', err)
      } finally {
        setLoading(false)
      }
    }

    loadSpec()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error loading API Documentation
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Med-Life API Documentation</h1>
              <p className="mt-2 text-blue-100">
                Documentación interactiva de la API del sistema de gestión médica
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">
                Version 1.0.0
              </span>
              <a
                href="/api/postman-collection"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                download="med-life-api.postman_collection.json"
              >
                📁 Postman
              </a>
              <a
                href="/dashboard"
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Volver al Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <a href="#overview" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2">
              Overview
            </a>
            <a href="#endpoints" className="text-gray-500 hover:text-gray-700 pb-2">
              Endpoints
            </a>
            <a href="#schemas" className="text-gray-500 hover:text-gray-700 pb-2">
              Schemas
            </a>
            <a href="#examples" className="text-gray-500 hover:text-gray-700 pb-2">
              Examples
            </a>
          </nav>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">15+</div>
              <div className="text-sm text-gray-600">Endpoints</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">4</div>
              <div className="text-sm text-gray-600">Recursos Principales</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">REST</div>
              <div className="text-sm text-gray-600">API Style</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">JSON</div>
              <div className="text-sm text-gray-600">Response Format</div>
            </div>
          </div>
        </div>
      </div>

      {/* Swagger UI */}
      <div className="max-w-7xl mx-auto">
        {spec && (
          <SwaggerUI
            spec={spec}
            deepLinking={true}
            displayOperationId={false}
            defaultModelsExpandDepth={1}
            defaultModelExpandDepth={1}
            defaultModelRendering="example"
            displayRequestDuration={true}
            docExpansion="list"
            filter={true}
            showExtensions={true}
            showCommonExtensions={true}
            tryItOutEnabled={true}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Med-Life API</h3>
              <p className="text-gray-300">
                Sistema de gestión médica con API REST completa para la administración 
                de pacientes, citas y servicios médicos.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Guía de inicio rápido</a></li>
                <li><a href="#" className="hover:text-white">Ejemplos de código</a></li>
                <li><a href="/api/postman-collection" className="hover:text-white">Postman Collection</a></li>
                <li><a href="/api/openapi-spec" className="hover:text-white">Especificación OpenAPI</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Documentación</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Reportar Bug</a></li>
                <li><a href="#" className="hover:text-white">Contacto</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Med-Life. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}