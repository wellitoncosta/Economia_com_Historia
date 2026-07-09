'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Send } from 'lucide-react'
import { api, getErrorMessage } from '@/lib/api'
import type { TipoConteudo } from '@/lib/types'

export default function NovoConteudoPage() {
  const router = useRouter()
  const [tipo, setTipo] = useState<TipoConteudo>('TEXTO')
  const [titulo, setTitulo] = useState('')
  const [tituloEn, setTituloEn] = useState('')
  const [descricao, setDescricao] = useState('')
  const [descricaoEn, setDescricaoEn] = useState('')
  const [categoria, setCategoria] = useState('')
  const [tags, setTags] = useState('')
  const [urlMidia, setUrlMidia] = useState('')
  const [corpoTexto, setCorpoTexto] = useState('')
  const [corpoTextoEn, setCorpoTextoEn] = useState('')
  const [exclusivo, setExclusivo] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    setSubmitting(true)
    setError('')
    try {
      await api.criarConteudo({
        titulo,
        tituloEn: tituloEn || undefined,
        descricao,
        descricaoEn: descricaoEn || undefined,
        tipo,
        categoria,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        urlMidia: urlMidia || null,
        corpoTexto: corpoTexto || null,
        corpoTextoEn: corpoTextoEn || null,
        exclusivo,
      })
      router.push('/admin/conteudos')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Novo Conteudo</h1>
          <p className="text-on-surface-variant">Crie uma nova publicacao para o acervo.</p>
        </div>
      </div>

      {error && <p className="rounded-md bg-error/10 p-4 text-sm text-error">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">Titulo da Publicacao</label>
                <Input value={titulo} onChange={(event) => setTitulo(event.target.value)} placeholder="Ex: O Ciclo da Borracha no Leste..." className="text-lg font-serif font-bold h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">Titulo em Ingles</label>
                <Input value={tituloEn} onChange={(event) => setTituloEn(event.target.value)} placeholder="Ex: The Rubber Cycle in the East..." className="text-lg font-serif font-bold h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">Descricao</label>
                <Textarea value={descricao} onChange={(event) => setDescricao(event.target.value)} placeholder="Resumo do conteudo..." className="min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">Descricao em Ingles</label>
                <Textarea value={descricaoEn} onChange={(event) => setDescricaoEn(event.target.value)} placeholder="Content summary in English..." className="min-h-[80px]" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">Texto Principal</label>
                <Textarea value={corpoTexto} onChange={(event) => setCorpoTexto(event.target.value)} className="min-h-[300px] resize-y" placeholder="Escreva o conteudo academico aqui..." />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">Texto Principal em Ingles</label>
                <Textarea value={corpoTextoEn} onChange={(event) => setCorpoTextoEn(event.target.value)} className="min-h-[220px] resize-y" placeholder="Write the English version here..." />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">Tipo de Conteudo</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['TEXTO', 'VIDEO', 'AUDIO'] as TipoConteudo[]).map((value) => (
                    <button key={value} onClick={() => setTipo(value)} className={`p-3 rounded-md flex flex-col items-center justify-center gap-2 border transition-colors ${tipo === value ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'}`}>
                      <span className="text-xs font-semibold">{value === 'TEXTO' ? 'Texto' : value === 'VIDEO' ? 'Video' : 'Audio'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">Categoria</label>
                <Input value={categoria} onChange={(event) => setCategoria(event.target.value)} placeholder="Programacao" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">Tags</label>
                <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="historia, economia" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-primary">URL de Midia</label>
                <Input value={urlMidia} onChange={(event) => setUrlMidia(event.target.value)} placeholder="https://..." />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={exclusivo} onChange={(event) => setExclusivo(event.target.checked)} />
                Exclusivo para subscritores
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <Button variant="secondary" className="w-full justify-start text-surface-container-lowest" onClick={submit} disabled={submitting}>
                <Send className="w-4 h-4 mr-2" /> {submitting ? 'A submeter...' : 'Submeter'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
