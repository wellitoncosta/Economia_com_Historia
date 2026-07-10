'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowUp, Flame, Lock, MessageCircle, Plus } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { api, getErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Forum, Topico } from '@/lib/types'

export default function ForumTopicosPage() {
  const { forumId } = useParams<{ forumId: string }>()
  const { user } = useAuth()
  const isRegistered = user !== null
  const isModerador = user?.role === 'MASTER' || user?.role === 'REVISOR'
  const canMarkJindungo = user?.role === 'CRIADOR' || user?.role === 'REVISOR' || user?.role === 'MASTER'

  const [forum, setForum] = useState<Forum | null>(null)
  const [topicos, setTopicos] = useState<Topico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [jindungo, setJindungo] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!forumId) return
    setLoading(true)
    setError('')
    Promise.all([
      api.foruns().then((data) => data.find((item) => item.id === forumId) ?? null),
      api.topicos(forumId),
    ])
      .then(([forumData, topicosData]) => {
        setForum(forumData)
        setTopicos(topicosData)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [forumId])

  const criarTopico = async () => {
    if (!titulo.trim() || !conteudo.trim()) return
    setCreating(true)
    setError('')
    try {
      const novo = await api.criarTopico({ forumId, titulo, conteudo })
      if (jindungo && canMarkJindungo) {
        const atualizado = await api.censurarTopico(novo.id, true).catch(() => ({ ...novo, censurado: true }))
        setTopicos((current) => [atualizado, ...current])
      } else {
        setTopicos((current) => [novo, ...current])
      }
      setTitulo('')
      setConteudo('')
      setJindungo(false)
      setShowForm(false)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCreating(false)
    }
  }

  const votar = async (topico: Topico, tipoVoto: 'UP' | 'DOWN') => {
    if (!isRegistered) return
    try {
      const result = await api.votar({ entidadeId: topico.id, tipoEntidade: 'TOPICO', tipoVoto })
      setTopicos((current) => current.map((item) => item.id === topico.id ? { ...item, score: result.score } : item))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const toggleCensura = async (topico: Topico) => {
    try {
      const atualizado = await api.censurarTopico(topico.id, !topico.censurado)
      setTopicos((current) => current.map((item) => item.id === topico.id ? atualizado : item))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-8">
      <Link href="/comunidade" className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Todos os foruns
      </Link>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">
            {loading ? 'A carregar...' : forum?.nome ?? 'Forum'}
          </h1>
          {forum?.descricao && <p className="text-on-surface-variant">{forum.descricao}</p>}
        </div>
        {isRegistered ? (
          <Button size="lg" variant="secondary" onClick={() => setShowForm((value) => !value)}>
            <Plus className="w-4 h-4 mr-2" /> Criar Topico
          </Button>
        ) : (
          <Button size="lg" variant="outline" asChild>
            <Link href="/">Entrar para participar</Link>
          </Button>
        )}
      </header>

      {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}

      {showForm && isRegistered && (
        <Card className="border-primary/20">
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-primary">Novo Topico</h2>
            <Input value={titulo} onChange={(event) => setTitulo(event.target.value)} placeholder="Titulo do topico" />
            <Textarea value={conteudo} onChange={(event) => setConteudo(event.target.value)} placeholder="Desenvolva a questao aqui..." rows={4} />

            {canMarkJindungo && (
              <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${jindungo ? 'border-error/60 bg-error/5' : 'border-outline-variant hover:border-primary/30'}`}>
                <input type="checkbox" checked={jindungo} onChange={(event) => setJindungo(event.target.checked)} className="w-4 h-4 mt-0.5 accent-red-600" />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    <Flame className="w-4 h-4 text-error" />
                    Topico com Jindungo
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">Topico polemico: apenas utilizadores com conta podem ver e comentar.</p>
                </div>
              </label>
            )}

            <div className="flex gap-2">
              <Button onClick={criarTopico} disabled={creating || !titulo.trim() || !conteudo.trim()}>
                {creating ? 'A publicar...' : 'Publicar Topico'}
              </Button>
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {loading && <p className="text-sm text-on-surface-variant">A carregar topicos...</p>}
        {!loading && topicos.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant">
            <MessageCircle className="w-10 h-10 opacity-30 mx-auto mb-2" />
            <p>Ainda nao ha topicos. Crie o primeiro.</p>
          </div>
        )}

        {topicos.map((topico) => {
          const isJindungo = topico.censurado === true
          if (isJindungo && !isRegistered) {
            return (
              <Card key={topico.id} className="border-error/20 bg-error/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <Lock className="w-5 h-5 text-error shrink-0" />
                  <div>
                    <p className="font-semibold text-error text-sm">Topico com Jindungo</p>
                    <p className="text-xs text-on-surface-variant">
                      Este topico e polemico e requer conta na plataforma.{' '}
                      <Link href="/" className="text-primary underline">Entrar / Criar conta</Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          }

          return (
            <Card key={topico.id} className={`hover:border-primary/30 transition-colors ${isJindungo ? 'border-error/30' : ''}`}>
              <CardContent className="p-0 flex">
                <div className="bg-surface-container-low w-14 flex flex-col items-center py-4 gap-1.5 rounded-l-xl border-r border-outline-variant">
                  <button disabled={!isRegistered} onClick={() => votar(topico, 'UP')} className="text-on-surface-variant hover:text-secondary disabled:opacity-40 transition-colors">
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-primary text-sm">{topico.score}</span>
                  <button disabled={!isRegistered} onClick={() => votar(topico, 'DOWN')} className="text-on-surface-variant hover:text-error disabled:opacity-40 transition-colors">
                    <ArrowDown className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-4 md:p-5 flex-1 space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-on-surface-variant">
                    {isJindungo && (
                      <Chip variant="default" className="bg-error/10 text-error border-error/20 gap-1">
                        <Flame className="w-3 h-3" /> Jindungo
                      </Chip>
                    )}
                    <span>Por <span className="font-bold text-primary">{topico.autorNome || topico.autorId.slice(0, 8)}</span></span>
                    <span>-</span>
                    <span>{new Date(topico.dataCriacao).toLocaleDateString('pt-AO')}</span>
                  </div>

                  <Link href={`/comunidade/${topico.id}`}>
                    <h3 className="font-serif text-lg font-bold text-on-surface hover:text-primary transition-colors leading-snug">{topico.titulo}</h3>
                  </Link>
                  <p className="text-sm text-on-surface-variant line-clamp-2">{topico.conteudo}</p>

                  <div className="flex items-center gap-4 pt-1">
                    <Link href={`/comunidade/${topico.id}`} className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" /> Comentarios
                    </Link>
                    {isModerador && (
                      <button onClick={() => toggleCensura(topico)} className={`flex items-center gap-1 text-xs font-semibold transition-colors ${isJindungo ? 'text-error hover:text-on-surface-variant' : 'text-on-surface-variant hover:text-error'}`}>
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {isJindungo ? 'Remover Jindungo' : 'Marcar Jindungo'}
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!isRegistered && (
        <div className="rounded-xl border border-outline-variant bg-surface-container p-4 text-center text-sm text-on-surface-variant">
          <Link href="/" className="text-primary font-semibold hover:underline">Inicie sessao</Link>{' '}
          para votar, comentar e criar topicos.
        </div>
      )}
    </div>
  )
}
