"use client"

import { Sidebar } from '@/components/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen" style={{backgroundColor: '#f1f5f9'}}>
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="p-4 pr-4 h-full">
          <div className="bg-white rounded-2xl shadow-lg h-full p-6 overflow-auto border border-gray-100">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}