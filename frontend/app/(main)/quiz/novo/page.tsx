'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, PlusCircle, Trash2 } from 'lucide-react'
import { api, getErrorMessage } from '@/lib/api'
import type { Forum } from '@/lib/types'

type DraftQuestion = { id: number; text: string; options: string[]; correct: number }

export default function NovoQuizPage() {
  const router = useRouter()
  const [foruns, setForuns] = useState<Forum[]>([])
  const [forumId, setForumId] = useState('')
  const [conteudoId, setConteudoId] = useState('')
  const [limiteUtilizadores, setLimiteUtilizadores] = useState('')
  const [tempoLimiteMs, setTempoLimiteMs] = useState(60000)
  const [pontosBase, setPontosBase] = useState(10)
  const [questions, setQuestions] = useState<DraftQuestion[]>([{ id: 1, text: '', options: ['', '', '', ''], correct: 0 }])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.foruns()
      .then((data) => {
        setForuns(data)
        setForumId(data[0]?.id || '')
      })
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  const addQuestion = () => {
    setQuestions([...questions, { id: questions.length + 1, text: '', options: ['', '', '', ''], correct: 0 }])
  }

  const removeQuestion = (index: number) => {
    if (questions.length > 1) setQuestions(questions.filter((_, i) => i !== index))
  }

  const submit = async () => {
    setError('')
    setSubmitting(true)
    try {
      const sala = await api.criarSala({
        forumId,
        conteudoId: conteudoId || null,
        limiteUtilizadores: limiteUtilizadores ? Number(limiteUtilizadores) : undefined,
        tempoLimiteMs,
        pontosBase,
      })
      for (const [index, question] of questions.entries()) {
        await api.adicionarPergunta(sala.id, {
          enunciado: question.text,
          alternativas: question.options.filter(Boolean),
          respostaCorreta: question.options[question.correct],
          ordem: index + 1,
        })
      }
      await api.iniciarSala(sala.id).catch(() => null)
      router.push(`/quiz/${sala.id}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Criar Novo Quiz</h1>
          <p className="text-on-surface-variant">Crie uma sala de quiz para a comunidade.</p>
        </div>
      </div>

      {error && <p className="rounded-md bg-error/10 p-4 text-sm text-error">{error}</p>}

      <Card>
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary">Forum</label>
              <select value={forumId} onChange={(event) => setForumId(event.target.value)} className="w-full h-12 rounded-md border border-outline bg-surface-container-lowest px-3">
                {foruns.map((forum) => <option key={forum.id} value={forum.id}>{forum.nome}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary">Conteudo associado (opcional)</label>
              <Input value={conteudoId} onChange={(event) => setConteudoId(event.target.value)} placeholder="ID do conteudo" className="h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary">Limite de utilizadores</label>
              <Input value={limiteUtilizadores} onChange={(event) => setLimiteUtilizadores(event.target.value)} type="number" min={1} placeholder="30" className="h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary">Tempo limite (ms)</label>
              <Input value={tempoLimiteMs} onChange={(event) => setTempoLimiteMs(Number(event.target.value))} type="number" min={1000} className="h-12" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary">Pontos base</label>
              <Input value={pontosBase} onChange={(event) => setPontosBase(Number(event.target.value))} type="number" min={1} className="h-12" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <Card key={q.id} className="relative">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-outline-variant pb-4">
                <h3 className="font-serif text-xl font-bold text-primary">Pergunta {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <Button variant="ghost" size="icon" className="text-error" onClick={() => removeQuestion(qIndex)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <Textarea value={q.text} onChange={(event) => {
                const copy = [...questions]
                copy[qIndex].text = event.target.value
                setQuestions(copy)
              }} placeholder="Escreva a pergunta aqui..." className="resize-y min-h-[80px]" />

              <div className="space-y-4">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Opcoes de Resposta</label>
                {[0, 1, 2, 3].map((optIndex) => (
                  <div key={optIndex} className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-colors ${q.correct === optIndex ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface-container-lowest'}`}>
                    <input
                      type="radio"
                      name={`correctAnswer-${qIndex}`}
                      checked={q.correct === optIndex}
                      onChange={() => {
                        const copy = [...questions]
                        copy[qIndex].correct = optIndex
                        setQuestions(copy)
                      }}
                      className="w-5 h-5 text-primary"
                    />
                    <Input value={q.options[optIndex]} onChange={(event) => {
                      const copy = [...questions]
                      copy[qIndex].options[optIndex] = event.target.value
                      setQuestions(copy)
                    }} placeholder={`Opcao ${optIndex + 1}`} className="flex-1 bg-transparent border-none focus-visible:ring-0 px-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <Button variant="outline" className="w-full md:w-auto border-dashed border-2" onClick={addQuestion}>
          <PlusCircle className="w-4 h-4 mr-2" /> Adicionar Outra Pergunta
        </Button>
      </div>

      <div className="flex justify-end pt-8">
        <Button size="lg" onClick={submit} disabled={submitting || !forumId}><Save className="w-4 h-4 mr-2" /> {submitting ? 'A publicar...' : 'Guardar e Publicar Quiz'}</Button>
      </div>
    </div>
  )
}
