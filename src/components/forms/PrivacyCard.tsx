import { Card } from '@/components/forms/Card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock } from 'lucide-react'

interface PrivacyData {
  consent: boolean
  private_notes?: string
}

interface PrivacyCardProps {
  data: PrivacyData
  onChange: (data: Partial<PrivacyData>) => void
  errors: Record<string, string>
}

export function PrivacyCard({ data, onChange, errors }: PrivacyCardProps) {
  return (
    <Card
      title="Privacidad y Auditoría"
      description="Consentimiento informado y observaciones confidenciales"
      actions={
        <div className="flex items-center space-x-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <Badge variant="secondary" className="text-xs">
            Confidencial
          </Badge>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Consentimiento informado */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Consentimiento Informado
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  Como profesional de la salud, debo asegurarme de que el paciente 
                  comprende y acepta el tratamiento propuesto.
                </p>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="consent"
                    checked={data.consent}
                    onCheckedChange={(checked) => onChange({ consent: !!checked })}
                    className={errors['consent'] ? 'border-red-500' : ''}
                  />
                  <Label htmlFor="consent" className="text-sm font-medium text-blue-900">
                    He informado al paciente sobre su condición, tratamiento propuesto, 
                    riesgos y beneficios, y he obtenido su consentimiento informado
                    <span className="text-red-500 ml-1">*</span>
                  </Label>
                </div>
                
                {errors['consent'] && (
                  <p className="text-sm text-red-600 mt-2">{errors['consent']}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Observaciones privadas */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Lock className="h-4 w-4 text-gray-600" />
            <Label htmlFor="private_notes" className="text-sm font-medium">
              Observaciones Privadas (Solo Médico/Admin)
            </Label>
          </div>
          
          <Textarea
            id="private_notes"
            value={data.private_notes || ''}
            onChange={(e) => onChange({ private_notes: e.target.value })}
            placeholder="Notas confidenciales, observaciones especiales, recordatorios internos..."
            rows={4}
            className="bg-gray-50 border-dashed"
          />
          
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <Lock className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Información Confidencial</p>
              <p>
                Estas observaciones son completamente privadas y solo pueden ser 
                vistas por el médico tratante y administradores del sistema. 
                No se incluyen en reportes para el paciente.
              </p>
            </div>
          </div>
        </div>

        {/* Información de auditoría */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Última edición: —</span>
            <span>Editor: —</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            La información de auditoría se completará automáticamente al guardar
          </p>
        </div>

        {/* Recordatorio legal */}
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
          <p className="text-xs text-gray-600">
            <strong>Recordatorio:</strong> Esta información médica está protegida por 
            las leyes de privacidad aplicables. El acceso, uso y divulgación están 
            restringidos a personal autorizado para fines de tratamiento, pago y 
            operaciones de atención médica.
          </p>
        </div>
      </div>
    </Card>
  )
}