'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react'
import { BackButton } from '@/components/ui/BackButton'
import * as Dialog from '@radix-ui/react-dialog'
import { api, getErrorMessage } from '@/lib/api'
import { createQuizClient } from '@/lib/quizSocket'
import type { PerguntaQuiz, RankingQuiz, ResultadoQuiz } from '@/lib/types'

export default function QuizExecutionPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const salaId = params.id
  const startedAt = useRef(0)
  const socketRef = useRef<ReturnType<typeof createQuizClient> | null>(null)
  const [questions, setQuestions] = useState<PerguntaQuiz[]>([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [waiting, setWaiting] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [result, setResult] = useState<ResultadoQuiz | null>(null)
  const [ranking, setRanking] = useState<RankingQuiz[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    startedAt.current = Date.now()
    setLoading(true)
    setError('')
    Promise.all([
      api.entrarSala(salaId).catch(() => null),
      api.perguntasSala(salaId),
      api.rankingSala(salaId).catch(() => []),
    ])
      .then(([, loadedQuestions, loadedRanking]) => {
        setQuestions(loadedQuestions.sort((a, b) => a.ordem - b.ordem))
        setRanking(loadedRanking)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))

    const socket = createQuizClient(salaId, {
      onResult: (payload) => {
        setResult(payload)
        setWaiting(false)
        setShowFeedback(true)
      },
      onRanking: setRanking,
      onError: setError,
    })
    socket.connect()
    socketRef.current = socket

    return () => {
      void socket.disconnect()
    }
  }, [salaId])

  const question = questions[current]
  const progress = useMemo(() => questions.length ? `${current + 1} de ${questions.length}` : '0 de 0', [current, questions.length])
  const timerPercent = question?.tempoLimiteMs ? Math.max(0, Math.min(100, (timeLeft / question.tempoLimiteMs) * 100)) : 100

  useEffect(() => {
    if (!question || showFeedback || waiting) return
    setTimeLeft(question.tempoLimiteMs)
    const interval = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 100))
    }, 100)
    return () => window.clearInterval(interval)
  }, [current, question, showFeedback, waiting])

  const handleConfirm = async () => {
    if (!question || selected === null) return
    setWaiting(true)
    setError('')
    try {
      const payload = {
        perguntaId: question.id,
        resposta: selected,
        tempoGastoMs: Date.now() - startedAt.current,
      }
      const resposta = await api.responderSala(salaId, payload)
      setResult(resposta)
      setShowFeedback(true)
      api.rankingSala(salaId).then(setRanking).catch(() => null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setWaiting(false)
    }
  }

  const handleNext = async () => {
    setShowFeedback(false)
    setResult(null)
    setSelected(null)
    if (current + 1 >= questions.length) {
      await api.finalizarSala(salaId).catch(() => null)
      router.push('/quiz')
      return
    }
    startedAt.current = Date.now()
    setCurrent((value) => value + 1)
  }

  if (loading) return <p className="text-sm text-on-surface-variant">A carregar sala...</p>
  if (error) return <p className="rounded-md bg-error/10 p-4 text-sm text-error">{error}</p>
  if (!question) return <p className="text-sm text-on-surface-variant">Esta sala ainda nao tem perguntas.</p>

  return (
    <div className="max-w-2xl mx-auto space-y-8 pt-8">
      <BackButton label="Voltar aos quizzes" />

      <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
        <span>Pergunta {progress}</span>
        <span className="flex items-center gap-1 font-mono bg-surface-container px-3 py-1 rounded-full text-primary">{Math.ceil(timeLeft / 1000)}s</span>
      </div>

      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
        <div className="bg-primary h-full transition-all duration-100 ease-linear" style={{ width: `${timerPercent}%` }}></div>
      </div>

      <h2 className="font-serif text-3xl font-bold text-primary leading-tight">
        {question.enunciado}
      </h2>

      <div className="space-y-3 pt-4">
        {question.alternativas.map((option) => (
          <button
            key={option}
            disabled={waiting || showFeedback}
            onClick={() => setSelected(option)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-lg
              ${selected === option
                ? 'border-secondary bg-secondary/10 text-primary'
                : 'border-outline-variant bg-surface-container-lowest hover:border-primary/50'
              }
              disabled:cursor-default
            `}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-outline-variant flex justify-between gap-4">
        <div className="text-xs text-on-surface-variant">
          {ranking.slice(0, 3).map((item) => (
            <p key={item.utilizadorId}>{item.utilizadorId.slice(0, 8)}: {item.pontuacao}</p>
          ))}
        </div>
        <Button size="lg" disabled={selected === null || waiting || showFeedback} onClick={handleConfirm}>
          {waiting ? 'A aguardar servidor...' : 'Confirmar Resposta'}
        </Button>
      </div>

      <Dialog.Root open={showFeedback} onOpenChange={setShowFeedback}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-inverse-surface/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-outline-variant bg-surface-container-lowest p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-xl">
            <div className="flex flex-col items-center text-center space-y-4">
              {result?.correta ? (
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-error" />
                </div>
              )}

              <Dialog.Title className="font-serif text-2xl font-bold text-primary">
                {result?.correta ? 'Correto!' : 'Incorreto'}
              </Dialog.Title>

              <div className="bg-surface-container-low p-4 rounded-lg text-left text-sm text-on-surface w-full leading-relaxed border-l-4 border-secondary">
                <span className="font-bold uppercase tracking-wider text-xs block mb-1 text-secondary">Resultado do servidor</span>
                +{result?.pontos || 0} pontos. Pontuacao acumulada: {result?.pontuacaoAcumulada || 0}.
              </div>

              <Button size="lg" className="w-full mt-4" onClick={handleNext}>
                Avancar <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
