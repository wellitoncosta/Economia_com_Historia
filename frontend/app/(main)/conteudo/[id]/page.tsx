'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Share2, Bookmark, Lock } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/app/contexts/AuthContext'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { api, contentTypeLabel, getErrorMessage } from '@/lib/api'
import type { Conteudo } from '@/lib/types'

export default function ConteudoDetalhePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { user } = useAuth()
  const { language } = useLanguage()
  const [conteudo, setConteudo] = useState<Conteudo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    api.conteudo(params.id)
      .then(setConteudo)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [params.id])
  const blocked = !!conteudo?.exclusivo && !user

  if (loading) return <p className="text-sm text-on-surface-variant">A carregar conteudo...</p>
  if (error) return <p className="rounded-md bg-error/10 p-4 text-sm text-error">{error}</p>
  if (!conteudo) return null
  const titulo = language === 'en' ? conteudo.tituloEn || conteudo.titulo : conteudo.titulo
  const descricao = language === 'en' ? conteudo.descricaoEn || conteudo.descricao : conteudo.descricao
  const corpoTexto = language === 'en' ? conteudo.corpoTextoEn || conteudo.corpoTexto : conteudo.corpoTexto

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      <Button variant="ghost" className="mb-4 -ml-4" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div className="relative min-h-64 md:min-h-96 w-full rounded-2xl overflow-hidden shadow-md bg-primary-container text-on-primary-container p-6 md:p-8 flex items-end">
        <div className="absolute inset-0 bg-sona opacity-20"></div>
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex flex-wrap gap-2">
            <Chip variant="secondary">{contentTypeLabel(conteudo.tipo)}</Chip>
            <Chip className="bg-surface-container-lowest text-on-surface">{conteudo.categoria}</Chip>
            {conteudo.exclusivo && <Chip variant="secondary">Exclusivo</Chip>}
          </div>
          <p className="text-xs uppercase tracking-[0.25em] font-semibold opacity-80">Conteudo da base de dados</p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-on-primary-container">
            {titulo}
          </h1>
          {descricao && <p className="text-sm md:text-base opacity-90 max-w-2xl">{descricao}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-outline-variant pb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-surface-container-lowest font-serif">A</div>
          <div>
            <p className="font-bold text-sm">Autor {conteudo.autorId.slice(0, 8)}</p>
            <p className="text-xs text-on-surface-variant">{new Date(conteudo.dataCriacao).toLocaleDateString('pt-AO')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" disabled={!user} title={!user ? 'Inicie sessao para guardar' : 'Guardar'}><Bookmark className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon"><Share2 className="w-4 h-4" /></Button>
        </div>
      </div>

      {blocked ? (
        <div className="max-w-2xl mx-auto text-center py-16 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-primary">Conteudo Exclusivo</h2>
            <p className="text-on-surface-variant">
              Este conteudo esta disponivel apenas para membros registados da plataforma.
              Crie uma conta gratuita para aceder.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild><Link href="/">Criar Conta / Entrar</Link></Button>
            <Button variant="outline" asChild><Link href="/conteudo">Ver outros conteudos</Link></Button>
          </div>
        </div>
      ) : (
        <article className="prose prose-lg md:prose-xl max-w-none prose-headings:font-serif prose-headings:text-primary prose-p:text-on-surface prose-p:leading-relaxed">
          <p className="font-serif text-xl md:text-2xl italic border-l-4 border-secondary pl-6 text-on-surface-variant">
            {descricao}
          </p>
          {conteudo.tipo === 'TEXTO' && <p>{corpoTexto || 'Sem corpo de texto publicado para este conteudo.'}</p>}
          {conteudo.tipo !== 'TEXTO' && conteudo.urlMidia && (
            <p>
              <a href={conteudo.urlMidia} target="_blank" rel="noreferrer">Abrir midia</a>
            </p>
          )}
        </article>
      )}
    </div>
  )
}

