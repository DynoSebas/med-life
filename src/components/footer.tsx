export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-4">Med-Life</h3>
            <p className="text-gray-600">
              Cuidando tu salud con tecnología y profesionalismo.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Consulta General</li>
              <li>Especialidades</li>
              <li>Laboratorio</li>
              <li>Telemedicina</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Teléfono: (555) 123-4567</li>
              <li>Email: info@med-life.com</li>
              <li>Dirección: Calle Salud 123</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Horarios</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Lun - Vie: 8:00 - 20:00</li>
              <li>Sáb: 9:00 - 16:00</li>
              <li>Dom: 10:00 - 14:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 mt-8 text-center text-gray-600">
          <p>&copy; 2025 Med-Life. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}