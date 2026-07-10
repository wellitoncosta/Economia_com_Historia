'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Clock, Play, Plus, Trophy, Users, Zap } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { api, getErrorMessage } from '@/lib/api'
import type { SalaQuiz } from '@/lib/types'

const estadoLabel: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'outline' }> = {
  AGUARDANDO: { label: 'A aguardar', color: 'outline' },
  EM_ANDAMENTO: { label: 'Em curso', color: 'primary' },
  FINALIZADA: { label: 'Finalizada', color: 'default' },
}

function normalizeSalas(data: unknown): SalaQuiz[] {
  if (Array.isArray(data)) return data as SalaQuiz[]
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    if (Array.isArray(record.content)) return record.content as SalaQuiz[]
    if (Array.isArray(record.salas)) return record.salas as SalaQuiz[]
    if (Array.isArray(record.data)) return record.data as SalaQuiz[]
  }
  return []
}

export default function QuizHubPage() {
  const router = useRouter()
  const { user } = useAuth()
  const isRegistered = user !== null
  const [salas, setSalas] = useState<SalaQuiz[]>([])
  const [filtro, setFiltro] = useState<string>('todos')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.salas()
      .then((data) => setSalas(normalizeSalas(data)))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const salasFiltradas = filtro === 'todos' ? salas : salas.filter((sala) => sala.estado === filtro)

  const entrar = async (salaId: string) => {
    if (isRegistered) {
      try {
      await api.entrarSala(salaId)
      } catch {
        // A sala pode ja conter o utilizador; nesse caso ainda deixamos abrir a sala.
      }
    }
    router.push(`/quiz/${salaId}`)
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:pt-8">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">Salas de Quiz</h1>
          <p className="text-on-surface-variant">Entre numa sala activa ou crie uma nova para testar conhecimentos.</p>
        </div>
        {isRegistered && (
          <div className="flex justify-start">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/quiz/novo"><Plus className="w-4 h-4 mr-2" /> Criar Quiz</Link>
            </Button>
          </div>
        )}
      </header>

      {isRegistered ? (
        <Card className="bg-primary-container text-on-primary-container border-none">
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0">
                <Trophy className="w-7 h-7 text-secondary" />
              </div>
              <div className="min-w-0">
                <p className="font-bold truncate">{user.email}</p>
                <p className="text-sm opacity-80 font-mono">{user.pontosAcumulados} pontos</p>
              </div>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link href="/rankings">Rankings</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-outline-variant">
          <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm text-on-surface-variant">Inicie sessao para guardar pontos e subir no ranking.</p>
            <Button size="sm" asChild><Link href="/">Entrar</Link></Button>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {['todos', 'AGUARDANDO', 'EM_ANDAMENTO', 'FINALIZADA'].map((item) => (
          <Chip key={item} variant={filtro === item ? 'primary' : 'outline'} className="cursor-pointer whitespace-nowrap" onClick={() => setFiltro(item)}>
            {item === 'todos' ? 'Todas' : estadoLabel[item].label}
          </Chip>
        ))}
      </div>

      {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}
      {loading && <p className="text-sm text-on-surface-variant">A carregar salas...</p>}
      {!loading && salasFiltradas.length === 0 && (
        <div className="text-center py-16 space-y-2">
          <Trophy className="w-12 h-12 text-on-surface-variant opacity-30 mx-auto" />
          <p className="text-on-surface-variant">Nenhuma sala disponivel.</p>
          {isRegistered && <Button asChild><Link href="/quiz/novo">Criar o primeiro quiz</Link></Button>}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {salasFiltradas.map((sala) => {
          const estado = estadoLabel[sala.estado] ?? { label: sala.estado, color: 'default' as const }
          const podeEntrar = sala.estado === 'AGUARDANDO' || sala.estado === 'EM_ANDAMENTO' || sala.estado === 'FINALIZADA'

          return (
            <Card key={sala.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <p className="font-semibold text-on-surface truncate">
                      {sala.titulo || `Quiz - ${sala.id.slice(0, 8)}`}
                    </p>
                    {sala.criadorEmail && (
                      <p className="text-xs text-on-surface-variant truncate">Criado por {sala.criadorEmail}</p>
                    )}
                    <Chip variant={estado.color} className="text-xs">{estado.label}</Chip>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {sala.tempoLimiteMs / 1000}s por pergunta
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Max. {sala.limiteUtilizadores ?? 'sem limite'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="w-3 h-3 text-secondary" />
                    {sala.pontosBase} pontos base
                  </div>
                </div>
                {podeEntrar ? (
                  <Button className="w-full" size="sm" onClick={() => entrar(sala.id)}>
                    <Play className="w-3 h-3 mr-1" />
                    {sala.estado === 'FINALIZADA' ? 'Jogar novamente' : isRegistered ? 'Entrar' : 'Jogar como visitante'}
                  </Button>
                ) : (
                  <Button className="w-full" size="sm" variant="outline" asChild>
                    <Link href={`/quiz/${sala.id}`}>Ver Resultados</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
