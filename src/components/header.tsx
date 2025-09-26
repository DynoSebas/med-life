import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="border-b border-med-pine-200 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-med-pine">
            Med-Life
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/services" className="text-med-pine-700 hover:text-med-milk transition-colors">
              Servicios
            </Link>
            <Link href="/about" className="text-med-pine-700 hover:text-med-milk transition-colors">
              Nosotros
            </Link>
            <Link href="/contact" className="text-med-pine-700 hover:text-med-milk transition-colors">
              Contacto
            </Link>
            <Button className="bg-med-milk hover:bg-med-milk-700 text-white">
              <Link href="/appointment">Agendar Cita</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  )
}