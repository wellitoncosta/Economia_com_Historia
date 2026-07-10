'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bookmark, BookOpen, Calendar, Users } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { api, getErrorMessage } from '@/lib/api'
import { BackButton } from '@/components/ui/BackButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Conteudo, Forum, Subscricao } from '@/lib/types'

export default function GuardadosPage() {
  const { user } = useAuth()
  const [subscricoes, setSubscricoes] = useState<Subscricao[]>([])
  const [conteudos, setConteudos] = useState<Record<string, Conteudo>>({})
  const [foruns, setForuns] = useState<Record<string, Forum>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    api.minhasSubscricoes()
      .then(async (subs) => {
        setSubscricoes(subs)
        const conteudoIds = subs.filter((item) => item.conteudoId).map((item) => item.conteudoId!)
        const forumIds = subs.filter((item) => item.forumId).map((item) => item.forumId!)

        const conteudoMap: Record<string, Conteudo> = {}
        await Promise.all(
          conteudoIds.map((id) =>
            api.conteudo(id).then((conteudo) => { conteudoMap[id] = conteudo }).catch(() => null)
          )
        )
        setConteudos(conteudoMap)

        const allForuns = await api.foruns().catch(() => [] as Forum[])
        const forumMap: Record<string, Forum> = {}
        allForuns.filter((forum) => forumIds.includes(forum.id)).forEach((forum) => { forumMap[forum.id] = forum })
        setForuns(forumMap)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [user])

  if (!user) {
    return (
      <div className="text-center py-16 space-y-3">
        <Bookmark className="w-12 h-12 text-on-surface-variant opacity-30 mx-auto" />
        <p className="text-on-surface-variant">Inicie sessao para ver os seus guardados.</p>
        <Button asChild><Link href="/">Entrar</Link></Button>
      </div>
    )
  }

  const subsAtivas = subscricoes.filter((item) => item.ativo)
  const subsConteudo = subsAtivas.filter((item) => item.conteudoId)
  const subsForum = subsAtivas.filter((item) => item.forumId)

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="space-y-1">
        <BackButton label="Voltar" />
        <h1 className="font-serif text-3xl font-bold text-primary">Guardados</h1>
        <p className="text-on-surface-variant">Conteudos e foruns que subscreveu.</p>
      </div>

      {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}
      {loading && <p className="text-sm text-on-surface-variant">A carregar...</p>}

      {subsConteudo.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-on-surface flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> Artigos e Conteudos ({subsConteudo.length})
          </h2>
          <div className="grid gap-3">
            {subsConteudo.map((sub) => {
              const conteudo = conteudos[sub.conteudoId!]
              return (
                <Link key={sub.id} href={`/conteudo/${sub.conteudoId}`}>
                  <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-on-surface truncate">{conteudo?.titulo ?? sub.conteudoId}</p>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          {new Date(sub.dataInicio).toLocaleDateString('pt-AO')}
                          {conteudo?.exclusivo && <span className="ml-2 bg-secondary/20 text-secondary px-1.5 py-0.5 rounded text-xs">Exclusivo</span>}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {subsForum.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-semibold text-on-surface flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Foruns subscritos ({subsForum.length})
          </h2>
          <div className="grid gap-3">
            {subsForum.map((sub) => {
              const forum = foruns[sub.forumId!]
              return (
                <Link key={sub.id} href={`/comunidade/forum/${sub.forumId}`}>
                  <Card className="hover:border-primary/30 transition-colors cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-on-surface truncate">{forum?.nome ?? sub.forumId}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          Subscrito em {new Date(sub.dataInicio).toLocaleDateString('pt-AO')}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {!loading && subsAtivas.length === 0 && (
        <div className="text-center py-16 space-y-3">
          <Bookmark className="w-12 h-12 text-on-surface-variant opacity-30 mx-auto" />
          <p className="text-on-surface-variant">Ainda nao guardou nenhum conteudo ou forum.</p>
          <Button variant="outline" asChild><Link href="/conteudo">Explorar conteudos</Link></Button>
        </div>
      )}
    </div>
  )
}
