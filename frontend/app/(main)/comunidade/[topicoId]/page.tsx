'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowDown, ArrowUp, Heart, MessageCircle, Reply, ShieldOff, Trash2 } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { api, getErrorMessage } from '@/lib/api'
import { hasAnyRole } from '@/lib/auth'
import type { Comentario, Topico } from '@/lib/types'

function ComentarioItem({
  comentario,
  onReply,
  onVote,
  isRegistered,
}: {
  comentario: Comentario
  onReply: (pai: string) => void
  onVote: (id: string, tipo: 'UP' | 'DOWN') => void
  isRegistered: boolean
}) {
  return (
    <div className="space-y-2">
      <Card className="border-outline-variant">
        <CardContent className="p-4 flex gap-3">
          <div className="flex flex-col items-center gap-1 min-w-8">
            <button disabled={!isRegistered} onClick={() => onVote(comentario.id, 'UP')} className="text-on-surface-variant hover:text-secondary disabled:opacity-40">
              <ArrowUp className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-primary">{comentario.score}</span>
            <button disabled={!isRegistered} onClick={() => onVote(comentario.id, 'DOWN')} className="text-on-surface-variant hover:text-primary disabled:opacity-40">
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm text-on-surface">{comentario.texto}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
              <span className="font-bold text-primary">{comentario.autorNome || comentario.autorId.slice(0, 8)}</span>
              <span>{new Date(comentario.dataCriacao).toLocaleDateString('pt-AO')}</span>
              <button onClick={() => onReply(comentario.id)} className="flex items-center gap-1 hover:text-primary transition-colors">
                <Reply className="w-3 h-3" /> Responder
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      {comentario.respostas?.length > 0 && (
        <div className="ml-6 border-l-2 border-outline-variant pl-4 space-y-2">
          {comentario.respostas.map((resposta) => (
            <ComentarioItem key={resposta.id} comentario={resposta} onReply={onReply} onVote={onVote} isRegistered={isRegistered} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function TopicoPage() {
  const { topicoId } = useParams<{ topicoId: string }>()
  const router = useRouter()
  const { user } = useAuth()
  const isRegistered = user !== null
  const canVote = hasAnyRole(user?.role, ['INSCRITO', 'CRIADOR', 'REVISOR', 'MASTER'])
  const [topico, setTopico] = useState<Topico | null>(null)
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [texto, setTexto] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [moderating, setModerating] = useState(false)

  const carregar = useCallback(async () => {
    const [topicData, commentsData] = await Promise.all([
      api.topico(topicoId).catch(() => null),
      api.comentarios(topicoId),
    ])
    setTopico(topicData)
    setComentarios(commentsData)
  }, [topicoId])

  useEffect(() => {
    if (!topicoId) return
    setLoading(true)
    setError('')
    carregar()
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [carregar, topicoId])

  const submeter = async () => {
    if (!texto.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await api.comentar(topicoId, { texto, comentarioPaiId: replyTo })
      await carregar()
      setTexto('')
      setReplyTo(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const votar = async (id: string, tipo: 'UP' | 'DOWN') => {
    if (!canVote) {
      setError(user ? 'A sua conta nao tem permissao para votar.' : 'Inicie sessao para votar.')
      return
    }
    try {
      await api.votar({ entidadeId: id, tipoEntidade: 'COMENTARIO', tipoVoto: tipo })
      await carregar()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const censurarTopico = async () => {
    if (!topico || user?.role !== 'MASTER') return
    setModerating(true)
    setError('')
    try {
      const updated = await api.censurarTopico(topico.id, !topico.censurado)
      setTopico(updated)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setModerating(false)
    }
  }

  const apagarTopico = async () => {
    if (!topico || !user || (user.role !== 'MASTER' && topico.autorId !== user.id)) return
    if (!window.confirm(`Apagar o topico "${topico.titulo}"?`)) return
    setError('')
    try {
      await api.apagarTopico(topico.id)
      router.push(`/comunidade/forum/${topico.forumId}`)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Link href="/comunidade" className="text-sm text-on-surface-variant hover:text-primary transition-colors">Voltar ao Forum</Link>

      {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}

      <Card className="overflow-hidden border-primary/20 bg-surface-container-lowest">
        <CardContent className="p-0">
          <div className="p-5 md:p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary">
                <Heart className="w-4 h-4" />
                Topico em debate
              </div>
              <div className="space-y-2">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-primary">{topico?.titulo || 'Topico'}</h1>
                {topico?.autorNome && <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Publicado por {topico.autorNome}</p>}
                {topico?.conteudo && <p className="text-on-surface-variant leading-relaxed">{topico.conteudo}</p>}
              </div>
              {user?.role === 'MASTER' && topico && (
                <Button variant="outline" size="sm" onClick={censurarTopico} disabled={moderating}>
                  <ShieldOff className="w-4 h-4 mr-2" />
                  {topico.censurado ? 'Remover censura' : 'Censurar topico'}
                </Button>
              )}
              {topico && user && (user.role === 'MASTER' || topico.autorId === user.id) && (
                <Button variant="outline" size="sm" className="border-error/40 text-error hover:bg-error/10" onClick={apagarTopico}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Apagar topico
                </Button>
              )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-secondary/30 bg-surface-container-lowest">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">{replyTo ? 'A responder a um comentario' : 'Comentar sobre este topico'}</span>
            {replyTo && (
              <button onClick={() => setReplyTo(null)} className="text-xs text-on-surface-variant hover:text-error ml-auto">
                Cancelar resposta
              </button>
            )}
          </div>
          <Textarea value={texto} onChange={(event) => setTexto(event.target.value)} placeholder="Escreva a sua opiniao sobre o topico..." rows={4} />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-on-surface-variant">{isRegistered ? 'O comentario sera publicado com a sua conta.' : 'Comentario permitido em modo visitante.'}</p>
            <Button onClick={submeter} disabled={submitting || !texto.trim()}>
              {submitting ? 'A publicar...' : 'Publicar comentario'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-serif text-xl font-bold text-primary flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comentarios ({comentarios.length})
        </h2>
        {loading && <p className="text-sm text-on-surface-variant">A carregar comentarios...</p>}
        {!loading && comentarios.length === 0 && (
          <p className="text-sm text-on-surface-variant text-center py-8">Ainda nao ha comentarios. Seja o primeiro!</p>
        )}
        {comentarios.map((comentario) => (
          <ComentarioItem
            key={comentario.id}
            comentario={comentario}
            onReply={(id) => {
              setReplyTo(id)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onVote={votar}
            isRegistered={canVote}
          />
        ))}
      </div>
    </div>
  )
}
