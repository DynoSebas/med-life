"use client"

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface Section {
  id: string
  title: string
}

interface ScrollSpyProps {
  sections: Section[]
}

export function ScrollSpy({ sections }: ScrollSpyProps) {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0px -35% 0px'
      }
    )

    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="sticky top-24">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Secciones</h4>
      <nav className="space-y-1">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              "block w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
              activeSection === section.id
                ? "bg-blue-50 text-blue-700 border-l-2 border-blue-500"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            )}
          >
            {section.title}
          </button>
        ))}
      </nav>
    </div>
  )
}