"use client"

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PatientPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PatientPage({ params }: PatientPageProps) {
  const router = useRouter()
  const { id } = use(params)

  useEffect(() => {
    // Redirigir automáticamente a la página de edición
    router.replace(`/patients/${id}/edit`)
  }, [id, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirigiendo a edición...</p>
      </div>
    </div>
  )
}