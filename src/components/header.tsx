import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Med-Life
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/services" className="text-gray-600 hover:text-blue-600 transition-colors">
              Servicios
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
              Nosotros
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Contacto
            </Link>
            <Button>
              <Link href="/appointment">Agendar Cita</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}