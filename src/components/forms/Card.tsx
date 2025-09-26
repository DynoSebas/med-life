import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  actions?: ReactNode
}

export function Card({ title, description, children, className, actions }: CardProps) {
  return (
    <div className={cn("rounded-2xl border bg-white p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center space-x-2">
            {actions}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}