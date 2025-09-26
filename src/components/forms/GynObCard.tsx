import { Card } from '@/components/forms/Card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface GynObData {
  menarca?: string
  fum?: string
  ciclo?: string
  gesta?: number
  para?: number
  abortos?: number
  metodo_anticonceptivo?: string
}

interface GynObCardProps {
  data: GynObData
  onChange: (data: Partial<GynObData>) => void
  errors: Record<string, string>
}

export function GynObCard({ data, onChange, errors }: GynObCardProps) {
  const handleInputChange = (field: keyof GynObData, value: string | number) => {
    onChange({ [field]: value })
  }

  return (
    <Card
      title="Antecedentes Gineco-obstétricos"
      description="Información específica para pacientes femeninas"
    >
      <div className="space-y-6">
        {/* Información menstrual */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="menarca">Menarca (edad)</Label>
            <Input
              id="menarca"
              value={data.menarca || ''}
              onChange={(e) => handleInputChange('menarca', e.target.value)}
              placeholder="Ej: 12 años"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fum">Fecha Última Menstruación</Label>
            <Input
              id="fum"
              type="date"
              value={data.fum || ''}
              onChange={(e) => handleInputChange('fum', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ciclo">Ciclo Menstrual</Label>
            <Input
              id="ciclo"
              value={data.ciclo || ''}
              onChange={(e) => handleInputChange('ciclo', e.target.value)}
              placeholder="Ej: 28 días, irregular"
            />
          </div>
        </div>

        {/* Información obstétrica */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Antecedentes Obstétricos</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gesta">Gestas</Label>
              <Input
                id="gesta"
                type="number"
                min="0"
                value={data.gesta || ''}
                onChange={(e) => handleInputChange('gesta', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-gray-500">Número total de embarazos</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="para">Partos</Label>
              <Input
                id="para"
                type="number"
                min="0"
                value={data.para || ''}
                onChange={(e) => handleInputChange('para', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-gray-500">Partos a término</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="abortos">Abortos</Label>
              <Input
                id="abortos"
                type="number"
                min="0"
                value={data.abortos || ''}
                onChange={(e) => handleInputChange('abortos', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-gray-500">Abortos espontáneos/inducidos</p>
            </div>
          </div>

          {/* Fórmula obstétrica */}
          {(data.gesta || data.para || data.abortos) && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>Fórmula obstétrica:</strong> G{data.gesta || 0} P{data.para || 0} A{data.abortos || 0}
              </p>
            </div>
          )}
        </div>

        {/* Método anticonceptivo */}
        <div className="space-y-2">
          <Label htmlFor="metodo_anticonceptivo">Método Anticonceptivo</Label>
          <Select 
            value={data.metodo_anticonceptivo || ''} 
            onValueChange={(value) => handleInputChange('metodo_anticonceptivo', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ninguno">Ninguno</SelectItem>
              <SelectItem value="preservativo">Preservativo</SelectItem>
              <SelectItem value="pildora">Píldora anticonceptiva</SelectItem>
              <SelectItem value="diu">DIU</SelectItem>
              <SelectItem value="implante">Implante subdérmico</SelectItem>
              <SelectItem value="inyeccion">Inyección</SelectItem>
              <SelectItem value="parche">Parche</SelectItem>
              <SelectItem value="natural">Métodos naturales</SelectItem>
              <SelectItem value="definitivo">Método definitivo</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  )
}