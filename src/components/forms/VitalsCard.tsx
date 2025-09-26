"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/forms/Card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface VitalsData {
  height_cm?: number
  weight_kg?: number
  bmi?: number
  bp?: string
  hr?: number
  rr?: number
  temp?: number
  spo2?: number
}

interface VitalsCardProps {
  data: VitalsData
  onChange: (data: Partial<VitalsData>) => void
  errors: Record<string, string>
}

export function VitalsCard({ data, onChange, errors }: VitalsCardProps) {
  const [bmiCategory, setBmiCategory] = useState<string>('')

  // Calcular IMC automáticamente
  useEffect(() => {
    if (data.height_cm && data.weight_kg) {
      const heightM = data.height_cm / 100
      const bmi = Math.round((data.weight_kg / (heightM * heightM)) * 10) / 10
      
      // Solo actualizar si el BMI calculado es diferente al actual
      if (data.bmi !== bmi) {
        onChange({ bmi })
      }

      // Categoría de IMC
      if (bmi < 18.5) setBmiCategory('Bajo peso')
      else if (bmi < 25) setBmiCategory('Normal')
      else if (bmi < 30) setBmiCategory('Sobrepeso')
      else setBmiCategory('Obesidad')
    } else {
      setBmiCategory('')
      if (data.bmi) {
        onChange({ bmi: undefined })
      }
    }
  }, [data.height_cm, data.weight_kg, data.bmi])

  const handleInputChange = (field: keyof VitalsData, value: string) => {
    const numericValue = parseFloat(value)
    onChange({ [field]: isNaN(numericValue) ? undefined : numericValue })
  }

  const getBmiVariant = () => {
    if (!data.bmi) return 'secondary'
    if (data.bmi < 18.5 || data.bmi >= 30) return 'destructive'
    if (data.bmi >= 25) return 'default'
    return 'default'
  }

  return (
    <Card
      title="Signos Vitales"
      description="Mediciones antropométricas y signos vitales básicos"
      actions={
        data.bmi && (
          <Badge variant={getBmiVariant()}>
            IMC: {data.bmi} - {bmiCategory}
          </Badge>
        )
      }
    >
      <div className="space-y-6">
        {/* Mediciones antropométricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Talla (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              value={data.height_cm || ''}
              onChange={(e) => handleInputChange('height_cm', e.target.value)}
              placeholder="170"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={data.weight_kg || ''}
              onChange={(e) => handleInputChange('weight_kg', e.target.value)}
              placeholder="70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bmi">IMC</Label>
            <Input
              id="bmi"
              type="number"
              step="0.1"
              value={data.bmi || ''}
              disabled
              className="bg-gray-50"
              placeholder="Calculado automáticamente"
            />
            {bmiCategory && (
              <p className="text-xs text-gray-600">{bmiCategory}</p>
            )}
          </div>
        </div>

        {/* Signos vitales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bp">Tensión Arterial</Label>
            <Input
              id="bp"
              value={data.bp || ''}
              onChange={(e) => onChange({ bp: e.target.value })}
              placeholder="120/80"
            />
            <p className="text-xs text-gray-500">mmHg</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hr">Frecuencia Cardíaca</Label>
            <Input
              id="hr"
              type="number"
              value={data.hr || ''}
              onChange={(e) => handleInputChange('hr', e.target.value)}
              placeholder="72"
            />
            <p className="text-xs text-gray-500">latidos/min</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rr">Frecuencia Respiratoria</Label>
            <Input
              id="rr"
              type="number"
              value={data.rr || ''}
              onChange={(e) => handleInputChange('rr', e.target.value)}
              placeholder="16"
            />
            <p className="text-xs text-gray-500">respiraciones/min</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temp">Temperatura</Label>
            <Input
              id="temp"
              type="number"
              step="0.1"
              value={data.temp || ''}
              onChange={(e) => handleInputChange('temp', e.target.value)}
              placeholder="36.5"
            />
            <p className="text-xs text-gray-500">°C</p>
          </div>
        </div>

        {/* SpO2 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spo2">Saturación de Oxígeno</Label>
            <Input
              id="spo2"
              type="number"
              min="0"
              max="100"
              value={data.spo2 || ''}
              onChange={(e) => handleInputChange('spo2', e.target.value)}
              placeholder="98"
            />
            <p className="text-xs text-gray-500">%</p>
          </div>
        </div>

        {/* Alertas de valores fuera de rango */}
        <div className="space-y-2">
          {data.temp && (data.temp < 35 || data.temp > 38) && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              ⚠️ Temperatura fuera del rango normal (35-38°C)
            </div>
          )}
          {data.hr && (data.hr < 60 || data.hr > 100) && (
            <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
              ⚠️ Frecuencia cardíaca fuera del rango normal (60-100 lpm)
            </div>
          )}
          {data.spo2 && data.spo2 < 95 && (
            <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              🚨 Saturación de oxígeno baja (&lt;95%)
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}