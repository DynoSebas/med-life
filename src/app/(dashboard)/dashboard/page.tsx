import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Calendar, Stethoscope, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-med-pine">Dashboard</h1>
        <p className="text-med-pine-600">Resumen general de Med-Life</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-med-pine">Pacientes Activos</CardTitle>
            <Users className="h-4 w-4 text-med-milk" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-med-pine">1,234</div>
            <p className="text-xs text-med-pine-600">
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-med-pine">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-med-milk" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-med-pine">28</div>
            <p className="text-xs text-med-pine-600">
              3 pendientes de confirmar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-med-pine">Servicios Activos</CardTitle>
            <Stethoscope className="h-4 w-4 text-med-milk" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-med-pine">15</div>
            <p className="text-xs text-med-pine-600">
              En 3 especialidades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-med-pine">Ingresos del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-med-milk" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-med-pine">$84,500</div>
            <p className="text-xs text-med-pine-600">
              +8% desde el mes pasado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Citas */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Citas</CardTitle>
            <CardDescription>Citas programadas para hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '09:00', patient: 'Ana García', service: 'Consulta General', status: 'confirmada' },
                { time: '09:30', patient: 'Carlos López', service: 'Chequeo Anual', status: 'programada' },
                { time: '10:00', patient: 'María Rodríguez', service: 'Telemedicina', status: 'confirmada' },
                { time: '10:30', patient: 'Pedro Martín', service: 'Electrocardiograma', status: 'programada' },
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-med-pine-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-med-pine">
                      {appointment.time}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-med-pine">{appointment.patient}</div>
                      <div className="text-sm text-med-pine-600">{appointment.service}</div>
                    </div>
                  </div>
                  <Badge variant={appointment.status === 'confirmada' ? 'success' : 'warning'}>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas y Recordatorios */}
        <Card>
          <CardHeader>
            <CardTitle>Alertas y Recordatorios</CardTitle>
            <CardDescription>Información importante para revisar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 border-l-4 border-med-milk bg-med-milk-50 rounded">
                <div className="flex-1">
                  <div className="text-sm font-medium text-med-milk-800">
                    3 pacientes sin confirmar cita
                  </div>
                  <div className="text-sm text-med-milk-600">
                    Recordatorios enviados hace 2 horas
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border-l-4 border-red-400 bg-red-50 rounded">
                <div className="flex-1">
                  <div className="text-sm font-medium text-red-800">
                    Juan Pérez - Alergia a penicilina
                  </div>
                  <div className="text-sm text-red-600">
                    Cita programada a las 14:00
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 border-l-4 border-med-pine bg-med-pine-50 rounded">
                <div className="flex-1">
                  <div className="text-sm font-medium text-med-pine-800">
                    Campaña Día de las Madres
                  </div>
                  <div className="text-sm text-med-pine-600">
                    Próximo envío programado para mañana
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}