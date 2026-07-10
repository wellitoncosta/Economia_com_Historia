'use client'

import Link from 'next/link'
import { ShieldOff, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'

export function BloqueioAlert() {
  const { user } = useAuth()
  const [dismissed, setDismissed] = useState(false)

  if (!user || user.role !== 'VISITANTE' || dismissed) return null

  return (
    <div className="rounded-xl border border-error/40 bg-error/5 p-4 flex items-start gap-3 relative">
      <div className="w-9 h-9 rounded-full bg-error/15 flex items-center justify-center shrink-0">
        <ShieldOff className="w-5 h-5 text-error" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-error text-sm">Conta com acesso restrito</p>
        <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
          A sua conta foi colocada em modo visitante por um administrador. Nao e possivel comentar,
          votar, criar quizzes ou publicar topicos. Se acredita que isto e um engano, contacte a administracao.
        </p>
        <Link href="mailto:admin@economiahist.ao" className="text-xs text-primary hover:underline mt-1 inline-block">
          Contactar administracao
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-on-surface-variant hover:text-error transition-colors shrink-0 mt-0.5"
        title="Fechar aviso"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
