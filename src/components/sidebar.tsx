"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  Stethoscope, 
  Megaphone, 
  BarChart3, 
  Settings,
  LogOut,
  BookOpen
} from 'lucide-react'

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pacientes', href: '/patients', icon: Users },
  { name: 'Agenda', href: '/appointments', icon: Calendar },
  { name: 'Expedientes', href: '/medical-records', icon: FileText },
  { name: 'Servicios', href: '/services', icon: Stethoscope },
  { name: 'Campañas', href: '/campaigns', icon: Megaphone },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'API Docs', href: '/api-docs', icon: BookOpen },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex w-64 flex-col rounded-2xl m-4 mr-2 shadow-sm", className)} style={{backgroundColor: '#00311F', height: 'calc(100vh - 2rem)'}}>
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b rounded-t-2xl" style={{borderColor: '#143f27'}}>
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#EC5E27'}}>
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold text-white">Med-Life</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "text-white border-r-2"
                  : "text-gray-300 hover:text-white"
              )}
              style={isActive ? 
                {backgroundColor: '#EC5E27', borderColor: '#f0a169'} : 
                {backgroundColor: 'transparent'}
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#143f27'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t p-4 rounded-b-2xl" style={{borderColor: '#143f27'}}>
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#EC5E27'}}>
            <span className="text-xs font-medium text-white">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              Usuario Demo
            </p>
            <p className="text-xs text-gray-300 truncate">
              admin@medlife.com
            </p>
          </div>
        </div>
        <button 
          className="flex items-center w-full px-3 py-2 text-sm text-gray-300 rounded-md transition-colors"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#143f27'
            e.currentTarget.style.color = 'white'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#d1d5db'
          }}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}