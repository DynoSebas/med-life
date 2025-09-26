"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/forms/Card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Plus } from 'lucide-react'

interface PatientData {
  first_name: string
  last_name: string
  sex: 'M' | 'F' | 'X' | ''
  date_of_birth: string
  phone: string
  email: string
  address_json: {
    calle: string
    ciudad: string
    cp: string
  }
  emergency_contact_json: {
    nombre: string
    relacion: string
    telefono: string
  }
  tags: string[]
}

interface IdentificationCardProps {
  data: PatientData
  onChange: (data: Partial<PatientData>) => void
  errors: Record<string, string>
}

export function IdentificationCard({ data, onChange, errors }: IdentificationCardProps) {
  const [age, setAge] = useState<number | null>(null)
  const [newTag, setNewTag] = useState('')

  // Calcular edad cuando cambia la fecha de nacimiento
  useEffect(() => {
    if (data.date_of_birth) {
      const birthDate = new Date(data.date_of_birth)
      const today = new Date()
      const calculatedAge = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        setAge(calculatedAge - 1)
      } else {
        setAge(calculatedAge)
      }
    } else {
      setAge(null)
    }
  }, [data.date_of_birth])

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      onChange({
        [parent]: {
          ...(data as any)[parent],
          [child]: value
        } as any
      })
    } else {
      onChange({ [field]: value } as any)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !data.tags.includes(newTag.trim())) {
      onChange({ tags: [...data.tags, newTag.trim()] })
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    onChange({ tags: data.tags.filter(tag => tag !== tagToRemove) })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Card
      title="Identificación"
      description="Información personal básica del paciente"
      actions={
        age !== null && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {age} años
          </Badge>
        )
      }
    >
      <div className="space-y-6">
        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first_name">
              Nombre(s) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="first_name"
              value={data.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              placeholder="Ej: María Elena"
              className={errors['patient.first_name'] ? 'border-red-500' : ''}
            />
            {errors['patient.first_name'] && (
              <p className="text-sm text-red-600">{errors['patient.first_name']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="last_name">
              Apellidos <span className="text-red-500">*</span>
            </Label>
            <Input
              id="last_name"
              value={data.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              placeholder="Ej: García López"
              className={errors['patient.last_name'] ? 'border-red-500' : ''}
            />
            {errors['patient.last_name'] && (
              <p className="text-sm text-red-600">{errors['patient.last_name']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">
              Fecha de nacimiento <span className="text-red-500">*</span>
            </Label>
            <Input
              id="date_of_birth"
              type="date"
              value={data.date_of_birth}
              onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
              className={errors['patient.date_of_birth'] ? 'border-red-500' : ''}
            />
            {errors['patient.date_of_birth'] && (
              <p className="text-sm text-red-600">{errors['patient.date_of_birth']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sex">Sexo</Label>
            <Select value={data.sex} onValueChange={(value) => handleInputChange('sex', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Femenino</SelectItem>
                <SelectItem value="X">No especifica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="3312345678"
              className={errors['patient.phone'] ? 'border-red-500' : ''}
            />
            {errors['patient.phone'] && (
              <p className="text-sm text-red-600">{errors['patient.phone']}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="paciente@ejemplo.com"
              className={errors['patient.email'] ? 'border-red-500' : ''}
            />
            {errors['patient.email'] && (
              <p className="text-sm text-red-600">{errors['patient.email']}</p>
            )}
          </div>
        </div>

        {(errors['patient.contact']) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{errors['patient.contact']}</p>
          </div>
        )}

        {/* Dirección */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Dirección</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="address_calle">Calle y número</Label>
              <Input
                id="address_calle"
                value={data.address_json.calle}
                onChange={(e) => handleInputChange('address_json.calle', e.target.value)}
                placeholder="Av. México 100, Col. Centro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_ciudad">Ciudad</Label>
              <Input
                id="address_ciudad"
                value={data.address_json.ciudad}
                onChange={(e) => handleInputChange('address_json.ciudad', e.target.value)}
                placeholder="Guadalajara"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_cp">Código Postal</Label>
              <Input
                id="address_cp"
                value={data.address_json.cp}
                onChange={(e) => handleInputChange('address_json.cp', e.target.value)}
                placeholder="44100"
              />
            </div>
          </div>
        </div>

        {/* Contacto de emergencia */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Contacto de emergencia</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_nombre">Nombre completo</Label>
              <Input
                id="emergency_nombre"
                value={data.emergency_contact_json.nombre}
                onChange={(e) => handleInputChange('emergency_contact_json.nombre', e.target.value)}
                placeholder="Luis García"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_relacion">Relación</Label>
              <Input
                id="emergency_relacion"
                value={data.emergency_contact_json.relacion}
                onChange={(e) => handleInputChange('emergency_contact_json.relacion', e.target.value)}
                placeholder="Esposo, Madre, Hijo..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergency_telefono">Teléfono</Label>
              <Input
                id="emergency_telefono"
                value={data.emergency_contact_json.telefono}
                onChange={(e) => handleInputChange('emergency_contact_json.telefono', e.target.value)}
                placeholder="3311223344"
              />
            </div>
          </div>
        </div>

        {/* Etiquetas */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Etiquetas</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {data.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nueva etiqueta..."
              className="flex-1"
            />
            <Button type="button" variant="outline" size="sm" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Ejemplos: VIP, Diabético, Hipertenso, Primera consulta
          </p>
        </div>
      </div>
    </Card>
  )
}