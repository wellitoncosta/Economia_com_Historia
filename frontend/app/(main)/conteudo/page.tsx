'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Filter, BookOpen, Video, Mic, Calendar, Lock, Plus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { api, contentTypeLabel, getErrorMessage } from '@/lib/api'
import type { Conteudo, TipoConteudo } from '@/lib/types'

const filters: Array<'Todos' | TipoConteudo> = ['Todos', 'TEXTO', 'VIDEO', 'AUDIO']

export default function ExplorarPage() {
  const { language } = useLanguage()
  const { role } = useAuth()
  const [filter, setFilter] = useState<'Todos' | TipoConteudo>('Todos')
  const [search, setSearch] = useState('')
  const [conteudos, setConteudos] = useState<Conteudo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.conteudos({ tipo: filter === 'Todos' ? undefined : filter })
      .then(setConteudos)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [filter])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return conteudos
    return conteudos.filter((item) =>
      [item.titulo, item.tituloEn, item.descricao, item.descricaoEn, item.categoria, ...(item.tags || [])]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    )
  }, [conteudos, search])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary">Explorar Acervo</h1>
          {(role === 'MASTER' || role === 'CRIADOR' || role === 'REVISOR') && (
            <Button variant="secondary" asChild>
              <Link href="/admin/conteudos/novo">
                <Plus className="w-4 h-4 mr-2" /> Publicar Artigo
              </Link>
            </Button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-10 h-12 bg-surface-container-lowest" placeholder="Pesquisar por tema, categoria, tag..." />
          </div>
          <Button variant="outline" className="h-12 w-full md:w-auto">
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </Button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((type) => (
            <Chip
              key={type}
              variant={filter === type ? 'primary' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setFilter(type)}
            >
              {type === 'Todos' ? 'Todos' : contentTypeLabel(type)}
            </Chip>
          ))}
        </div>
      </header>

      {loading && <p className="text-sm text-on-surface-variant">A carregar conteudos...</p>}
      {error && <p className="rounded-md bg-error/10 p-4 text-sm text-error">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading && filtered.map((item) => {
          const titulo = language === 'en' ? item.tituloEn || item.titulo : item.titulo
          const descricao = language === 'en' ? item.descricaoEn || item.descricao : item.descricao

          return (
          <Link key={item.id} href={`/conteudo/${item.id}`}>
            <Card className="group h-full flex flex-col hover:border-primary/50 transition-colors">
              <div className="relative h-40 w-full overflow-hidden rounded-t-xl bg-primary-container text-on-primary-container p-5 flex flex-col justify-between">
                <div className="absolute inset-0 bg-sona opacity-20"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <Chip variant="secondary">{contentTypeLabel(item.tipo)}</Chip>
                  {item.tipo === 'TEXTO' && <BookOpen className="w-8 h-8 opacity-80" />}
                  {item.tipo === 'VIDEO' && <Video className="w-8 h-8 opacity-80" />}
                  {item.tipo === 'AUDIO' && <Mic className="w-8 h-8 opacity-80" />}
                </div>
                <div className="relative z-10 space-y-1">
                  <p className="text-xs uppercase tracking-widest font-semibold opacity-80">{item.categoria}</p>
                  <p className="font-serif text-xl font-bold line-clamp-2">{titulo}</p>
                </div>
              </div>
              <CardContent className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {item.tipo === 'TEXTO' && <BookOpen className="w-4 h-4 text-on-surface-variant" />}
                  {item.tipo === 'VIDEO' && <Video className="w-4 h-4 text-on-surface-variant" />}
                  {item.tipo === 'AUDIO' && <Mic className="w-4 h-4 text-on-surface-variant" />}
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{item.categoria}</span>
                  {item.exclusivo && (
                    <span className="inline-flex items-center gap-1 text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" /> Exclusivo
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-xl font-bold leading-tight group-hover:text-primary transition-colors flex-1">
                  {titulo}
                </h3>
                <p className="text-sm text-on-surface-variant mt-3 line-clamp-2">{descricao}</p>
                <div className="flex items-center gap-2 mt-4 text-sm text-on-surface-variant font-medium pt-3 border-t border-outline-variant">
                  <Calendar className="w-4 h-4" />
                  {new Date(item.dataCriacao).toLocaleDateString('pt-AO')}
                </div>
              </CardContent>
            </Card>
          </Link>
        )})}
      </div>

      {!loading && filtered.length === 0 && !error && (
        <p className="text-sm text-on-surface-variant">Nao ha conteudos para os filtros selecionados.</p>
      )}
    </div>
  )
}

