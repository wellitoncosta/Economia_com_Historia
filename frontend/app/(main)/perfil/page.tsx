'use client'

import Link from 'next/link'
import { Building, MapPin, Star, User } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BackButton } from '@/components/ui/BackButton'
import { roleLabels } from '@/lib/auth'

export default function PerfilPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-on-surface-variant">Precisa de iniciar sessao para ver o seu perfil.</p>
        <Button asChild><Link href="/">Iniciar Sessao</Link></Button>
      </div>
    )
  }

  const inicial = user.email.charAt(0).toUpperCase()

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <header className="space-y-2">
        <BackButton label="Voltar" />
        <h1 className="font-serif text-3xl font-bold text-primary">O Meu Perfil</h1>
        <p className="text-on-surface-variant">Informacoes da sua conta na plataforma.</p>
      </header>

      <Card>
        <CardContent className="p-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-surface-container-lowest font-serif font-bold text-3xl shrink-0">
            {inicial}
          </div>
          <div className="space-y-1 min-w-0">
            <h2 className="font-serif text-xl font-bold text-on-surface break-all">{user.email}</h2>
            <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {roleLabels[user.role]}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-on-surface">Informacoes</h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-on-surface-variant shrink-0" />
              <span className="text-on-surface-variant">ID:</span>
              <span className="font-mono text-xs text-on-surface break-all">{user.id}</span>
            </div>
            {user.regiao && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-on-surface-variant shrink-0" />
                <span className="text-on-surface-variant">Regiao:</span>
                <span className="text-on-surface">{user.regiao}</span>
              </div>
            )}
            {user.instituicao && (
              <div className="flex items-center gap-3 text-sm">
                <Building className="w-4 h-4 text-on-surface-variant shrink-0" />
                <span className="text-on-surface-variant">Instituicao:</span>
                <span className="text-on-surface">{user.instituicao}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Star className="w-4 h-4 text-secondary shrink-0" />
              <span className="text-on-surface-variant">Pontos acumulados:</span>
              <span className="font-bold text-secondary">{user.pontosAcumulados}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" asChild>
        <Link href="/configuracoes">Configuracoes da Conta</Link>
      </Button>
    </div>
  )
}
