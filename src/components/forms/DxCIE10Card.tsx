"use client"

import { useState } from 'react'
import { Card } from '@/components/forms/Card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, Plus, Search } from 'lucide-react'

interface DxCIE10CardProps {
  data: string[]
  onChange: (data: string[]) => void
  errors: Record<string, string>
}

// Simulación de códigos CIE-10 comunes
const COMMON_CIE10 = [
  { code: 'Z00.0', description: 'Examen médico general' },
  { code: 'R51.9', description: 'Cefalea no especificada' },
  { code: 'K59.0', description: 'Estreñimiento' },
  { code: 'R50.9', description: 'Fiebre no especificada' },
  { code: 'J06.9', description: 'Infección aguda de vías respiratorias superiores' },
  { code: 'K21.9', description: 'Enfermedad por reflujo gastroesofágico' },
  { code: 'M79.3', description: 'Paniculitis no especificada' },
  { code: 'E78.5', description: 'Hiperlipidemia no especificada' },
  { code: 'I10', description: 'Hipertensión esencial' },
  { code: 'E11.9', description: 'Diabetes mellitus tipo 2 sin complicaciones' },
]

interface DiagnosisItem {
  code: string
  description: string
  status: 'active' | 'resolved'
  date: string
}

export function DxCIE10Card({ data, onChange, errors }: DxCIE10CardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<DiagnosisItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredCodes = COMMON_CIE10.filter(
    item => 
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addDiagnosis = (code: string, description: string) => {
    if (!data.includes(code)) {
      const newDiagnosis: DiagnosisItem = {
        code,
        description,
        status: 'active',
        date: new Date().toISOString().split('T')[0]
      }
      setSelectedDiagnoses([...selectedDiagnoses, newDiagnosis])
      onChange([...data, code])
      setSearchTerm('')
      setShowSuggestions(false)
    }
  }

  const removeDiagnosis = (codeToRemove: string) => {
    setSelectedDiagnoses(selectedDiagnoses.filter(dx => dx.code !== codeToRemove))
    onChange(data.filter(code => code !== codeToRemove))
  }

  const toggleDiagnosisStatus = (code: string) => {
    setSelectedDiagnoses(selectedDiagnoses.map(dx => 
      dx.code === code 
        ? { ...dx, status: dx.status === 'active' ? 'resolved' : 'active' }
        : dx
    ))
  }

  return (
    <Card
      title="Diagnósticos CIE-10"
      description="Códigos diagnósticos según la Clasificación Internacional de Enfermedades"
    >
      <div className="space-y-6">
        {/* Buscador */}
        <div className="relative">
          <div className="space-y-2">
            <Label htmlFor="diagnosis-search">Buscar diagnóstico</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="diagnosis-search"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setShowSuggestions(e.target.value.length > 0)
                }}
                onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                placeholder="Buscar por código o descripción..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Sugerencias */}
          {showSuggestions && filteredCodes.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredCodes.slice(0, 8).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => addDiagnosis(item.code, item.description)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  disabled={data.includes(item.code)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{item.code}</div>
                      <div className="text-xs text-gray-600">{item.description}</div>
                    </div>
                    {data.includes(item.code) && (
                      <Badge variant="secondary" className="text-xs">
                        Agregado
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Diagnósticos seleccionados */}
        {selectedDiagnoses.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Diagnósticos Registrados</h4>
            {selectedDiagnoses.map((diagnosis) => (
              <div
                key={diagnosis.code}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {diagnosis.code}
                    </Badge>
                    <Badge 
                      variant={diagnosis.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {diagnosis.status === 'active' ? 'Activo' : 'Resuelto'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-900">{diagnosis.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Fecha: {new Date(diagnosis.date).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDiagnosisStatus(diagnosis.code)}
                  >
                    {diagnosis.status === 'active' ? 'Resolver' : 'Activar'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => removeDiagnosis(diagnosis.code)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Códigos CIE-10 comunes */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Diagnósticos Frecuentes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {COMMON_CIE10.slice(0, 6).map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => addDiagnosis(item.code, item.description)}
                disabled={data.includes(item.code)}
                className="text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="font-medium text-sm">{item.code}</div>
                <div className="text-xs text-gray-600 truncate">{item.description}</div>
              </button>
            ))}
          </div>
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No hay diagnósticos registrados</p>
            <p className="text-xs mt-1">Use el buscador o seleccione de los diagnósticos frecuentes</p>
          </div>
        )}
      </div>
    </Card>
  )
}