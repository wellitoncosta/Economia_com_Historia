'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/app/contexts/LanguageContext'

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()
  const next = language === 'pt' ? 'English' : 'Portugues'

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-xs font-bold uppercase tracking-wider text-on-surface hover:text-primary hover:bg-primary/10 transition-colors shadow-sm"
      title={`Trocar idioma para ${next}`}
      aria-label={`Trocar idioma para ${next}`}
    >
      <Languages className="w-4 h-4" />
      {language.toUpperCase()}
    </button>
  )
}
