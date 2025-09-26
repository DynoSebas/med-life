"use client"

import { useState } from 'react'
import { Card } from '@/components/forms/Card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { X, Plus, Trash2 } from 'lucide-react'

interface MedicalRecordData {
  allergies: string[]
  chronic_conditions: string[]
  meds_current: Array<{
    drug: string
    dose: string
    frequency: string
    notes?: string
  }>
  surgeries: string[]
  family_history: Record<string, string>
  lifestyle: {
    tabaquismo: string
    alcohol: string
    actividad: string
    sueno: string
    dieta: string
  }
}

interface HistoryCardProps {
  data: MedicalRecordData
  onChange: (data: Partial<MedicalRecordData>) => void
  errors: Record<string, string>
}

const CHRONIC_CONDITIONS = [
  'Diabetes Mellitus Tipo 1',
  'Diabetes Mellitus Tipo 2',
  'Hipertensión Arterial',
  'Enfermedad Cardiovascular',
  'Asma',
  'EPOC',
  'Artritis',
  'Osteoporosis',
  'Hipotiroidismo',
  'Hipertiroidismo',
  'Depresión',
  'Ansiedad'
]

export function HistoryCard({ data, onChange, errors }: HistoryCardProps) {
  const [newAllergy, setNewAllergy] = useState('')
  const [newSurgery, setNewSurgery] = useState('')
  const [newMed, setNewMed] = useState({
    drug: '',
    dose: '',
    frequency: '',
    notes: ''
  })

  const addAllergy = () => {
    if (newAllergy.trim() && !data.allergies.includes(newAllergy.trim())) {
      onChange({ allergies: [...data.allergies, newAllergy.trim()] })
      setNewAllergy('')
    }
  }

  const removeAllergy = (allergyToRemove: string) => {
    onChange({ allergies: data.allergies.filter(allergy => allergy !== allergyToRemove) })
  }

  const toggleChronicCondition = (condition: string) => {
    const current = data.chronic_conditions || []
    if (current.includes(condition)) {
      onChange({ chronic_conditions: current.filter(c => c !== condition) })
    } else {
      onChange({ chronic_conditions: [...current, condition] })
    }
  }

  const addSurgery = () => {
    if (newSurgery.trim() && !data.surgeries.includes(newSurgery.trim())) {
      onChange({ surgeries: [...data.surgeries, newSurgery.trim()] })
      setNewSurgery('')
    }
  }

  const removeSurgery = (surgeryToRemove: string) => {
    onChange({ surgeries: data.surgeries.filter(surgery => surgery !== surgeryToRemove) })
  }

  const addMedication = () => {
    if (newMed.drug.trim() && newMed.dose.trim() && newMed.frequency.trim()) {
      onChange({ 
        meds_current: [...data.meds_current, { ...newMed, drug: newMed.drug.trim() }] 
      })
      setNewMed({ drug: '', dose: '', frequency: '', notes: '' })
    }
  }

  const removeMedication = (index: number) => {
    onChange({ 
      meds_current: data.meds_current.filter((_, i) => i !== index) 
    })
  }

  const updateLifestyle = (field: keyof typeof data.lifestyle, value: string) => {
    onChange({
      lifestyle: {
        ...data.lifestyle,
        [field]: value
      }
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      action()
    }
  }

  return (
    <Card
      title="Antecedentes Médicos"
      description="Historia clínica, alergias y condiciones crónicas"
    >
      <div className="space-y-8">
        {/* Alergias */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">Alergias</h4>
            {data.allergies.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                {data.allergies.length} registrada{data.allergies.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {data.allergies.map((allergy, index) => (
              <Badge key={index} variant="destructive" className="flex items-center space-x-1">
                <span>{allergy}</span>
                <button
                  type="button"
                  onClick={() => removeAllergy(allergy)}
                  className="ml-1 hover:text-red-300"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={newAllergy}
              onChange={(e) => setNewAllergy(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addAllergy)}
              placeholder="Ej: Penicilina, Mariscos, Polen..."
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={addAllergy}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Enfermedades Crónicas */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Enfermedades Crónicas</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CHRONIC_CONDITIONS.map((condition) => (
              <div key={condition} className="flex items-center space-x-2">
                <Checkbox
                  id={condition}
                  checked={data.chronic_conditions?.includes(condition) || false}
                  onCheckedChange={() => toggleChronicCondition(condition)}
                />
                <Label htmlFor={condition} className="text-sm cursor-pointer">
                  {condition}
                </Label>
              </div>
            ))}
          </div>
          
          {data.chronic_conditions && data.chronic_conditions.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Condiciones registradas:</strong> {data.chronic_conditions.join(', ')}
              </p>
            </div>
          )}
        </div>

        {/* Cirugías */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Cirugías Previas</h4>
          
          <div className="space-y-2">
            {data.surgeries.map((surgery, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <span className="text-sm">{surgery}</span>
                <button
                  type="button"
                  onClick={() => removeSurgery(surgery)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <Input
              value={newSurgery}
              onChange={(e) => setNewSurgery(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addSurgery)}
              placeholder="Ej: Colecistectomía 2018, Apendicectomía..."
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={addSurgery}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Medicamentos Actuales */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Medicamentos Actuales</h4>
          
          {data.meds_current.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Medicamento</th>
                    <th className="text-left py-2">Dosis</th>
                    <th className="text-left py-2">Frecuencia</th>
                    <th className="text-left py-2">Notas</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.meds_current.map((med, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2">{med.drug}</td>
                      <td className="py-2">{med.dose}</td>
                      <td className="py-2">{med.frequency}</td>
                      <td className="py-2">{med.notes || '-'}</td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => removeMedication(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-md">
            <Input
              value={newMed.drug}
              onChange={(e) => setNewMed({ ...newMed, drug: e.target.value })}
              placeholder="Medicamento"
            />
            <Input
              value={newMed.dose}
              onChange={(e) => setNewMed({ ...newMed, dose: e.target.value })}
              placeholder="Dosis (ej: 50mg)"
            />
            <Input
              value={newMed.frequency}
              onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
              placeholder="Frecuencia"
            />
            <div className="flex space-x-2">
              <Input
                value={newMed.notes}
                onChange={(e) => setNewMed({ ...newMed, notes: e.target.value })}
                placeholder="Notas (opcional)"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addMedication}
                disabled={!newMed.drug.trim() || !newMed.dose.trim() || !newMed.frequency.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Hábitos de Vida */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Hábitos de Vida</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tabaquismo">Tabaquismo</Label>
              <Input
                id="tabaquismo"
                value={data.lifestyle.tabaquismo}
                onChange={(e) => updateLifestyle('tabaquismo', e.target.value)}
                placeholder="Ej: No, Sí (10 cigarros/día), Ex-fumador"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="alcohol">Consumo de Alcohol</Label>
              <Input
                id="alcohol"
                value={data.lifestyle.alcohol}
                onChange={(e) => updateLifestyle('alcohol', e.target.value)}
                placeholder="Ej: Social, Ocasional, No consume"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actividad">Actividad Física</Label>
              <Input
                id="actividad"
                value={data.lifestyle.actividad}
                onChange={(e) => updateLifestyle('actividad', e.target.value)}
                placeholder="Ej: 3x por semana, Sedentario, Deportista"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sueno">Hábitos de Sueño</Label>
              <Input
                id="sueno"
                value={data.lifestyle.sueno}
                onChange={(e) => updateLifestyle('sueno', e.target.value)}
                placeholder="Ej: 7-8 horas, Insomnio, Normal"
              />
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="dieta">Dieta</Label>
              <Input
                id="dieta"
                value={data.lifestyle.dieta}
                onChange={(e) => updateLifestyle('dieta', e.target.value)}
                placeholder="Ej: Omnívora, Vegetariana, Diabética, Sin restricciones"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}