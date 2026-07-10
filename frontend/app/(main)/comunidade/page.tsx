'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Flame, Lock, Plus, Trash2, Users } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { api, getErrorMessage } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Forum } from '@/lib/types'

export default function ForunsPage() {
  const { user } = useAuth()
  const isRegistered = user !== null
  const [foruns, setForuns] = useState<Forum[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [privado, setPrivado] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    setError('')
    setLoading(true)
    api.foruns()
      .then(setForuns)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const criarForum = async () => {
    if (!nome.trim()) return
    setCreating(true)
    setError('')
    try {
      const novo = await api.criarForum({ nome, descricao, privado })
      setForuns((current) => [novo, ...current])
      setNome('')
      setDescricao('')
      setPrivado(false)
      setShowCreate(false)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setCreating(false)
    }
  }

  const apagarForum = async (forum: Forum) => {
    if (!user || forum.donoId !== user.id) return
    if (!window.confirm(`Apagar o forum "${forum.nome}"?`)) return
    setError('')
    try {
      await api.apagarForum(forum.id)
      setForuns((current) => current.filter((item) => item.id !== forum.id))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:pt-8">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">Foruns</h1>
          <p className="text-on-surface-variant">Escolha um forum para ver e debater os seus topicos.</p>
        </div>
        {isRegistered && (
          <div className="flex justify-start">
            <Button size="lg" variant="secondary" onClick={() => setShowCreate((value) => !value)}>
              <Plus className="w-4 h-4 mr-2" /> Criar Forum
            </Button>
          </div>
        )}
      </header>

      {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}

      {showCreate && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-semibold text-primary">Novo Forum</h2>
            <Input value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Nome do forum" />
            <Textarea value={descricao} onChange={(event) => setDescricao(event.target.value)} placeholder="Descricao opcional" rows={2} />
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={privado} onChange={(event) => setPrivado(event.target.checked)} className="w-4 h-4" />
              Forum privado
            </label>
            <div className="flex gap-2">
              <Button onClick={criarForum} disabled={creating || !nome.trim()}>
                {creating ? 'A criar...' : 'Criar Forum'}
              </Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && <p className="text-sm text-on-surface-variant">A carregar foruns...</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {foruns.map((forum, index) => (
          <Card key={forum.id} className="hover:border-primary/40 hover:shadow-sm transition-all h-full">
            <CardContent className="p-5 flex items-center gap-4">
              <Link href={`/comunidade/forum/${forum.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 relative">
                  {index === 0 ? <Flame className="w-6 h-6 text-secondary" /> : <Users className="w-6 h-6 text-primary" />}
                  {forum.privado && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-outline-variant rounded-full flex items-center justify-center">
                      <Lock className="w-2.5 h-2.5 text-on-surface-variant" />
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-on-surface truncate">{forum.nome}</h3>
                  {forum.descricao && <p className="text-sm text-on-surface-variant line-clamp-1 mt-0.5">{forum.descricao}</p>}
                  <p className="text-xs text-on-surface-variant mt-1">
                    {new Date(forum.dataCriacao).toLocaleDateString('pt-AO')}
                    {forum.privado && ' - Privado'}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-on-surface-variant shrink-0" />
              </Link>
              {user?.id === forum.donoId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-error/40 text-error hover:bg-error/10 shrink-0"
                  onClick={() => apagarForum(forum)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && foruns.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <Users className="w-12 h-12 text-on-surface-variant opacity-30 mx-auto" />
          <p className="text-on-surface-variant">Ainda nao ha foruns. Crie o primeiro.</p>
        </div>
      )}
    </div>
  )
}
