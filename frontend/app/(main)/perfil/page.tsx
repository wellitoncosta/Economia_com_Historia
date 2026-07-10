'use client'

import Link from 'next/link'
import { Building, Calendar, Mail, MapPin, Settings, Star, Trophy, User } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BackButton } from '@/components/ui/BackButton'
import { roleLabels } from '@/lib/auth'

function nivelPorPontos(pontos: number) {
  if (pontos >= 5000) return { nivel: 5, titulo: 'Mestre de Sona', proximo: 5000 }
  if (pontos >= 2500) return { nivel: 4, titulo: 'Guardiao da Historia', proximo: 5000 }
  if (pontos >= 1000) return { nivel: 3, titulo: 'Investigador', proximo: 2500 }
  if (pontos >= 300) return { nivel: 2, titulo: 'Aprendiz Avancado', proximo: 1000 }
  return { nivel: 1, titulo: 'Aprendiz', proximo: 300 }
}

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
  const { nivel, titulo, proximo } = nivelPorPontos(user.pontosAcumulados)
  const progresso = Math.min(100, Math.round((user.pontosAcumulados / proximo) * 100))

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      <div className="space-y-1">
        <BackButton label="Voltar" />
        <h1 className="font-serif text-3xl font-bold text-primary">O Meu Perfil</h1>
        <p className="text-sm text-on-surface-variant">Resumo da sua conta, progresso e identidade academica.</p>
      </div>

      <Card className="overflow-hidden border-primary/20">
        <CardContent className="p-0">
          <div className="bg-primary text-surface-container-lowest p-6 flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-surface-container-lowest text-primary flex items-center justify-center font-serif font-bold text-4xl shrink-0">
              {inicial}
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-widest opacity-80">{roleLabels[user.role]}</p>
              <h2 className="font-serif text-2xl font-bold truncate">{user.email}</h2>
              <p className="text-sm opacity-80">{titulo}</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-secondary/10 p-4 text-center">
                <p className="text-3xl font-bold text-secondary font-mono">{user.pontosAcumulados}</p>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">Pontos Totais</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-4 text-center">
                <p className="text-3xl font-bold text-primary font-mono">{nivel}</p>
                <p className="text-xs text-on-surface-variant mt-1 font-medium">Nivel Actual</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-on-surface-variant">
                <span>{titulo}</span>
                <span>{user.pontosAcumulados} / {proximo} pts</span>
              </div>
              <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700" style={{ width: `${progresso}%` }} />
              </div>
              <p className="text-xs text-on-surface-variant text-right">{progresso}% para o proximo nivel</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-3">
          <h2 className="font-semibold text-on-surface mb-4">Informacoes da Conta</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <Mail className="w-4 h-4 text-on-surface-variant shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-on-surface-variant">E-mail</p>
                <p className="text-sm font-medium text-on-surface truncate">{user.email}</p>
              </div>
            </div>
            {user.regiao && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
                <MapPin className="w-4 h-4 text-on-surface-variant shrink-0" />
                <div>
                  <p className="text-xs text-on-surface-variant">Regiao</p>
                  <p className="text-sm font-medium text-on-surface">{user.regiao}</p>
                </div>
              </div>
            )}
            {user.instituicao && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
                <Building className="w-4 h-4 text-on-surface-variant shrink-0" />
                <div>
                  <p className="text-xs text-on-surface-variant">Instituicao</p>
                  <p className="text-sm font-medium text-on-surface">{user.instituicao}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
              <Calendar className="w-4 h-4 text-on-surface-variant shrink-0" />
              <div>
                <p className="text-xs text-on-surface-variant">ID da conta</p>
                <p className="text-xs font-mono text-on-surface break-all">{user.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/configuracoes"><Settings className="w-4 h-4" /> Configuracoes</Link>
        </Button>
        <Button variant="outline" className="gap-2" asChild>
          <Link href="/rankings"><Trophy className="w-4 h-4" /> Rankings</Link>
        </Button>
      </div>
    </div>
  )
}
