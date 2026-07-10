'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  BookOpen,
  Check,
  Eye,
  EyeOff,
  MessageSquare,
  Shield,
  Trash2,
  Trophy,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { api, getErrorMessage } from '@/lib/api'
import { BackButton } from '@/components/ui/BackButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Conteudo, Forum, Role, SalaQuiz, Utilizador } from '@/lib/types'

type Tab = 'utilizadores' | 'foruns' | 'conteudos' | 'quizzes'

const rolesDisponiveis: Role[] = ['INSCRITO', 'CRIADOR', 'REVISOR', 'MASTER']

function ConfirmDialog({
  mensagem,
  onConfirm,
  onCancel,
}: {
  mensagem: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            <p className="text-sm text-on-surface">{mensagem}</p>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={onCancel}>Cancelar</Button>
            <Button size="sm" className="bg-error text-white hover:bg-error/90" onClick={onConfirm}>
              Confirmar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function GerirSistemaPage() {
  const router = useRouter()
  const { user, role } = useAuth()
  const [tab, setTab] = useState<Tab>('utilizadores')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirm, setConfirm] = useState<{ msg: string; fn: () => void } | null>(null)
  const [utilizadores, setUtilizadores] = useState<Utilizador[]>([])
  const [searchUser, setSearchUser] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [foruns, setForuns] = useState<Forum[]>([])
  const [loadingForuns, setLoadingForuns] = useState(false)
  const [conteudos, setConteudos] = useState<Conteudo[]>([])
  const [loadingConteudos, setLoadingConteudos] = useState(false)
  const [quizzes, setQuizzes] = useState<SalaQuiz[]>([])
  const [loadingQuizzes, setLoadingQuizzes] = useState(false)

  useEffect(() => {
    if (user && role !== 'MASTER') router.replace('/dashboard')
  }, [user, role, router])

  useEffect(() => {
    setError('')
    if (tab === 'utilizadores' && utilizadores.length === 0) {
      setLoadingUsers(true)
      api.listarUtilizadores()
        .then(setUtilizadores)
        .catch((err) => setError(getErrorMessage(err)))
        .finally(() => setLoadingUsers(false))
    }
    if (tab === 'foruns' && foruns.length === 0) {
      setLoadingForuns(true)
      api.foruns()
        .then(setForuns)
        .catch((err) => setError(getErrorMessage(err)))
        .finally(() => setLoadingForuns(false))
    }
    if (tab === 'conteudos' && conteudos.length === 0) {
      setLoadingConteudos(true)
      api.conteudos()
        .then(setConteudos)
        .catch((err) => setError(getErrorMessage(err)))
        .finally(() => setLoadingConteudos(false))
    }
    if (tab === 'quizzes' && quizzes.length === 0) {
      setLoadingQuizzes(true)
      api.salas()
        .then(setQuizzes)
        .catch((err) => setError(getErrorMessage(err)))
        .finally(() => setLoadingQuizzes(false))
    }
  }, [tab, utilizadores.length, foruns.length, conteudos.length, quizzes.length])

  const showSuccess = (message: string) => {
    setSuccess(message)
    setTimeout(() => setSuccess(''), 3000)
  }

  const askConfirm = (msg: string, fn: () => void) => setConfirm({ msg, fn })

  const alterarRole = async (utilizador: Utilizador, novoRole: Role) => {
    try {
      const updated = await api.alterarRole(utilizador.id, novoRole)
      setUtilizadores((current) => current.map((item) => item.id === utilizador.id ? updated : item))
      showSuccess(`Role de ${utilizador.email} alterado para ${novoRole}.`)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const bloquearUtilizador = (utilizador: Utilizador) => askConfirm(
    `Bloquear ${utilizador.email}? O utilizador ficara como VISITANTE sem acesso a funcionalidades.`,
    async () => {
      await alterarRole(utilizador, 'VISITANTE')
      setConfirm(null)
    }
  )

  const apagarForum = (forum: Forum) => askConfirm(
    `Apagar o forum "${forum.nome}"? Esta acao apaga topicos associados.`,
    async () => {
      try {
        await api.apagarForum(forum.id)
        setForuns((current) => current.filter((item) => item.id !== forum.id))
        showSuccess(`Forum "${forum.nome}" apagado.`)
      } catch (err) {
        setError(getErrorMessage(err))
      }
      setConfirm(null)
    }
  )

  const apagarConteudo = (conteudo: Conteudo) => askConfirm(
    `Apagar o conteudo "${conteudo.titulo}"?`,
    async () => {
      try {
        await api.apagarConteudo(conteudo.id)
        setConteudos((current) => current.filter((item) => item.id !== conteudo.id))
        showSuccess('Conteudo apagado.')
      } catch (err) {
        setError(getErrorMessage(err))
      }
      setConfirm(null)
    }
  )

  const ocultarConteudo = async (conteudo: Conteudo) => {
    try {
      const updated = await api.ocultarConteudo(conteudo.id, !conteudo.approved)
      setConteudos((current) => current.map((item) => item.id === conteudo.id ? updated : item))
      showSuccess(`Conteudo ${updated.approved ? 'publicado' : 'ocultado'}.`)
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const apagarQuiz = (quiz: SalaQuiz) => askConfirm(
    'Apagar esta sala de quiz?',
    async () => {
      try {
        await api.apagarSalaQuiz(quiz.id)
        setQuizzes((current) => current.filter((item) => item.id !== quiz.id))
        showSuccess('Sala de quiz apagada.')
      } catch (err) {
        setError(getErrorMessage(err))
      }
      setConfirm(null)
    }
  )

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'utilizadores', label: 'Utilizadores', icon: Users },
    { id: 'foruns', label: 'Foruns', icon: MessageSquare },
    { id: 'conteudos', label: 'Conteudos', icon: BookOpen },
    { id: 'quizzes', label: 'Quizzes', icon: Trophy },
  ]

  const utilizadoresFiltrados = utilizadores.filter((utilizador) =>
    utilizador.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    utilizador.role.toLowerCase().includes(searchUser.toLowerCase())
  )

  if (!user || role !== 'MASTER') return null

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {confirm && <ConfirmDialog mensagem={confirm.msg} onConfirm={confirm.fn} onCancel={() => setConfirm(null)} />}

      <div className="space-y-1">
        <BackButton label="Voltar" />
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary">Gerir Sistema</h1>
            <p className="text-sm text-on-surface-variant">Painel de administracao exclusivo do Master.</p>
          </div>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" /> {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-primary flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" /> {success}
        </p>
      )}

      <div className="flex gap-1 bg-surface-container p-1 rounded-xl overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setTab(id); setError('') }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors flex-1 justify-center ${
              tab === id ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'utilizadores' && (
        <div className="space-y-4">
          <Input value={searchUser} onChange={(event) => setSearchUser(event.target.value)} placeholder="Filtrar por email ou role..." />
          {loadingUsers && <p className="text-sm text-on-surface-variant">A carregar utilizadores...</p>}
          <div className="space-y-2">
            {utilizadoresFiltrados.map((utilizador) => {
              const isBlocked = utilizador.role === 'VISITANTE'
              return (
                <Card key={utilizador.id} className={isBlocked ? 'border-error/30 bg-error/5' : ''}>
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-on-surface text-sm truncate">{utilizador.email}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isBlocked ? 'bg-error/20 text-error' : utilizador.role === 'MASTER' ? 'bg-secondary/20 text-secondary' : 'bg-primary/10 text-primary'}`}>
                          {utilizador.role}
                        </span>
                        {isBlocked && <span className="text-xs text-error font-medium">Bloqueado</span>}
                      </div>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {utilizador.pontosAcumulados} pts - {utilizador.regiao || 'Regiao nao definida'} - {utilizador.instituicao || '-'}
                      </p>
                    </div>
                    {utilizador.id !== user.id && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <select
                          defaultValue={utilizador.role}
                          onChange={(event) => alterarRole(utilizador, event.target.value as Role)}
                          className="h-8 text-xs rounded-lg border border-outline bg-surface-container-lowest px-2 text-on-surface"
                        >
                          {rolesDisponiveis.map((roleItem) => <option key={roleItem} value={roleItem}>{roleItem}</option>)}
                        </select>
                        <Button
                          size="sm"
                          variant="outline"
                          className={`text-xs gap-1 ${isBlocked ? 'border-primary/40 text-primary' : 'border-error/40 text-error hover:bg-error/10'}`}
                          onClick={() => isBlocked ? alterarRole(utilizador, 'INSCRITO') : bloquearUtilizador(utilizador)}
                        >
                          <Shield className="w-3 h-3" />
                          {isBlocked ? 'Desbloquear' : 'Bloquear'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
          {!loadingUsers && utilizadoresFiltrados.length === 0 && <p className="text-center text-on-surface-variant py-8">Nenhum utilizador encontrado.</p>}
        </div>
      )}

      {tab === 'foruns' && (
        <div className="space-y-3">
          {loadingForuns && <p className="text-sm text-on-surface-variant">A carregar foruns...</p>}
          {foruns.map((forum) => (
            <Card key={forum.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface truncate">{forum.nome}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {forum.privado ? 'Privado' : 'Publico'} - Criado em {new Date(forum.dataCriacao).toLocaleDateString('pt-AO')}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="border-error/40 text-error hover:bg-error/10 gap-1 shrink-0" onClick={() => apagarForum(forum)}>
                  <Trash2 className="w-3.5 h-3.5" /> Apagar
                </Button>
              </CardContent>
            </Card>
          ))}
          {!loadingForuns && foruns.length === 0 && <p className="text-center text-on-surface-variant py-8">Nenhum forum encontrado.</p>}
        </div>
      )}

      {tab === 'conteudos' && (
        <div className="space-y-3">
          {loadingConteudos && <p className="text-sm text-on-surface-variant">A carregar conteudos...</p>}
          {conteudos.map((conteudo) => (
            <Card key={conteudo.id} className={!conteudo.approved ? 'border-outline-variant opacity-60' : ''}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface truncate">{conteudo.titulo}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {conteudo.tipo} - {conteudo.categoria}
                    {conteudo.exclusivo && <span className="ml-2 text-secondary font-medium">Exclusivo</span>}
                    {!conteudo.approved && <span className="ml-2 text-error font-medium">Oculto</span>}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" className="gap-1 text-xs border-outline-variant" onClick={() => ocultarConteudo(conteudo)}>
                    {conteudo.approved ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {conteudo.approved ? 'Ocultar' : 'Publicar'}
                  </Button>
                  <Button size="sm" variant="outline" className="border-error/40 text-error hover:bg-error/10 gap-1 text-xs" onClick={() => apagarConteudo(conteudo)}>
                    <Trash2 className="w-3.5 h-3.5" /> Apagar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {!loadingConteudos && conteudos.length === 0 && <p className="text-center text-on-surface-variant py-8">Nenhum conteudo encontrado.</p>}
        </div>
      )}

      {tab === 'quizzes' && (
        <div className="space-y-3">
          {loadingQuizzes && <p className="text-sm text-on-surface-variant">A carregar quizzes...</p>}
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface truncate">{quiz.titulo || `Quiz - ${quiz.id.slice(0, 12)}...`}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Estado: {quiz.estado} - {quiz.tempoLimiteMs / 1000}s/pergunta - {quiz.pontosBase} pts base
                  </p>
                </div>
                <Button size="sm" variant="outline" className="border-error/40 text-error hover:bg-error/10 gap-1 text-xs shrink-0" onClick={() => apagarQuiz(quiz)}>
                  <Trash2 className="w-3.5 h-3.5" /> Apagar
                </Button>
              </CardContent>
            </Card>
          ))}
          {!loadingQuizzes && quizzes.length === 0 && <p className="text-center text-on-surface-variant py-8">Nenhuma sala de quiz encontrada.</p>}
        </div>
      )}
    </div>
  )
}
