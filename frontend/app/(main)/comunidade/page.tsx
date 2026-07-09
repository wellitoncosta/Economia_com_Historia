'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Flame, ArrowUp, ArrowDown, Plus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { api, getErrorMessage } from '@/lib/api'
import type { Forum, Topico } from '@/lib/types'

export default function ForumPage() {
  const { user } = useAuth()
  const isRegistered = user !== null
  const [foruns, setForuns] = useState<Forum[]>([])
  const [selectedForum, setSelectedForum] = useState<string>('')
  const [topics, setTopics] = useState<Topico[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
    api.foruns()
      .then((data) => {
        setForuns(data)
        setSelectedForum(data[0]?.id || '')
      })
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  useEffect(() => {
    if (!selectedForum) {
      setTopics([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    api.topicos(selectedForum)
      .then(setTopics)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [selectedForum])

  const createTopic = async () => {
    if (!selectedForum) return
    setError('')
    try {
      const created = await api.criarTopico({ forumId: selectedForum, titulo: title, conteudo: content })
      setTopics((current) => [created, ...current])
      setTitle('')
      setContent('')
      setShowForm(false)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const vote = async (topic: Topico, tipoVoto: 'UP' | 'DOWN') => {
    try {
      const result = await api.votar({ entidadeId: topic.id, tipoEntidade: 'TOPICO', tipoVoto })
      setTopics((current) => current.map((item) => item.id === topic.id ? { ...item, score: result.score } : item))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">Comunidade & Forum</h1>
          <p className="text-on-surface-variant">Debata com estudantes e especialistas sobre a nossa historia.</p>
        </div>
        {isRegistered ? (
          <Button size="lg" variant="secondary" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-2" /> Criar Novo Topico</Button>
        ) : (
          <Button size="lg" variant="outline" disabled title="Inicie sessao para criar topicos">Criar Novo Topico</Button>
        )}
      </header>

      {error && <p className="rounded-md bg-error/10 p-4 text-sm text-error">{error}</p>}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-outline-variant">
        {foruns.map((forum, index) => (
          <Chip key={forum.id} variant={selectedForum === forum.id ? 'primary' : 'outline'} className="cursor-pointer" onClick={() => setSelectedForum(forum.id)}>
            {index === 0 && <Flame className="w-3 h-3 mr-1" />}
            {forum.nome}
          </Chip>
        ))}
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Titulo do topico" />
            <Textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Conteudo do topico" />
            <Button onClick={createTopic}>Publicar Topico</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {loading && <p className="text-sm text-on-surface-variant">A carregar topicos...</p>}
        {!loading && topics.map((topic) => (
          <Card key={topic.id} className="hover:border-primary/30 transition-colors">
            <CardContent className="p-0 flex">
              <div className="bg-surface-container-low w-16 flex flex-col items-center py-4 gap-2 rounded-l-xl border-r border-outline-variant">
                <button disabled={!isRegistered} onClick={() => vote(topic, 'UP')} className="text-on-surface-variant hover:text-secondary disabled:opacity-50"><ArrowUp className="w-5 h-5" /></button>
                <span className="font-bold text-primary">{topic.score}</span>
                <button disabled={!isRegistered} onClick={() => vote(topic, 'DOWN')} className="text-on-surface-variant hover:text-primary disabled:opacity-50"><ArrowDown className="w-5 h-5" /></button>
              </div>

              <div className="p-4 md:p-6 flex-1 space-y-3">
                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <Chip variant="default">{foruns.find((forum) => forum.id === topic.forumId)?.nome || 'Forum'}</Chip>
                  <span>Postado por <span className="font-bold text-primary">{topic.autorNome || topic.autorId.slice(0, 8)}</span></span>
                  <span>{new Date(topic.dataCriacao).toLocaleDateString('pt-AO')}</span>
                </div>

                <h3 className="font-serif text-xl font-bold text-on-surface leading-tight">
                  {topic.titulo}
                </h3>
                <p className="text-sm text-on-surface-variant">{topic.conteudo}</p>

                <div className="flex items-center gap-4 text-sm font-semibold text-on-surface-variant pt-2">
                  <Link href={`/comunidade/${topic.id}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" /> Comentarios
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {!isRegistered && (
        <div className="text-center p-4 text-sm text-on-surface-variant bg-surface-container rounded-md">
          Faca login para interagir, votar e criar novos topicos na comunidade.
        </div>
      )}
    </div>
  )
}
