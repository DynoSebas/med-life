import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'

export function AllergyFlag() {
  return (
    <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 flex items-center space-x-1">
      <AlertTriangle className="h-3 w-3" />
      <span>ALERGIAS REGISTRADAS</span>
    </Badge>
  )
}