"use client"

import { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/forms/Card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface SoapData {
  S: string
  O: string
  A: string
  P: string
}

interface SoapCardProps {
  data: SoapData
  onChange: (data: Partial<SoapData>) => void
  errors: Record<string, string>
}

export function SoapCard({ data, onChange, errors }: SoapCardProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Debounced autosave
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (field: keyof SoapData, value: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          onChange({ [field]: value })
          setLastSaved(new Date())
        }, 800)
      }
    })(),
    [onChange]
  )

  const handleChange = (field: keyof SoapData, value: string) => {
    // Actualización inmediata en UI
    onChange({ [field]: value })
    // Autoguardado con debounce
    debouncedSave(field, value)
  }

  return (
    <Card
      title="Nota Clínica (S.O.A.P.)"
      description="Registro estructurado de la consulta médica"
      actions={
        lastSaved && (
          <Badge variant="secondary" className="text-xs">
            Guardado: {lastSaved.toLocaleTimeString()}
          </Badge>
        )
      }
    >
      <div className="space-y-6">
        {/* Subjetivo */}
        <div className="space-y-2">
          <Label htmlFor="soap-s">
            Subjetivo <span className="text-sm text-gray-500">(S)</span>
          </Label>
          <Textarea
            id="soap-s"
            value={data.S}
            onChange={(e) => handleChange('S', e.target.value)}
            placeholder="Síntomas reportados por el paciente, historia de la enfermedad actual..."
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Información proporcionada por el paciente
          </p>
        </div>

        {/* Objetivo */}
        <div className="space-y-2">
          <Label htmlFor="soap-o">
            Objetivo <span className="text-sm text-gray-500">(O)</span>
          </Label>
          <Textarea
            id="soap-o"
            value={data.O}
            onChange={(e) => handleChange('O', e.target.value)}
            placeholder="Signos vitales, exploración física, estudios de laboratorio..."
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Hallazgos objetivos del examen físico
          </p>
        </div>

        {/* Análisis */}
        <div className="space-y-2">
          <Label htmlFor="soap-a">
            Análisis <span className="text-sm text-gray-500">(A)</span>
          </Label>
          <Textarea
            id="soap-a"
            value={data.A}
            onChange={(e) => handleChange('A', e.target.value)}
            placeholder="Diagnóstico diferencial, impresión clínica, evaluación..."
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Interpretación y diagnóstico médico
          </p>
        </div>

        {/* Plan */}
        <div className="space-y-2">
          <Label htmlFor="soap-p">
            Plan <span className="text-sm text-gray-500">(P)</span>
          </Label>
          <Textarea
            id="soap-p"
            value={data.P}
            onChange={(e) => handleChange('P', e.target.value)}
            placeholder="Tratamiento, estudios adicionales, seguimiento, educación al paciente..."
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Plan de tratamiento y seguimiento
          </p>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Los cambios se guardan automáticamente después de dejar de escribir
          </p>
        </div>
      </div>
    </Card>
  )
}