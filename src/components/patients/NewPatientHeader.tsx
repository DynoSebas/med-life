import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AllergyFlag } from '@/components/common/AllergyFlag'
import { Loader2 } from 'lucide-react'

interface NewPatientHeaderProps {
  onSave: () => void
  onCancel: () => void
  hasAllergies: boolean
  isLoading: boolean
  errors: Record<string, string>
  onClearError: (errorKey: string) => void
}

export function NewPatientHeader({ 
  onSave, 
  onCancel, 
  hasAllergies, 
  isLoading, 
  errors,
  onClearError
}: NewPatientHeaderProps) {
  const hasErrors = Object.keys(errors).length > 0
  // Solo deshabilitar el botón por errores de validación, no por errores generales
  const hasValidationErrors = Object.keys(errors).some(key => key !== 'general')

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Nuevo Paciente</h1>
            {hasAllergies && <AllergyFlag />}
            {hasErrors && (
              <Badge variant="destructive" className="animate-pulse">
                {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 'es' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={onSave}
              disabled={isLoading || hasValidationErrors}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Paciente
            </Button>
          </div>
        </div>
        
        {errors.general && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
            <p className="text-sm text-red-800">{errors.general}</p>
            <button
              onClick={() => onClearError('general')}
              className="text-red-600 hover:text-red-800 text-sm font-medium ml-2 px-2 py-1 hover:bg-red-100 rounded"
              title="Cerrar mensaje de error"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  )
}