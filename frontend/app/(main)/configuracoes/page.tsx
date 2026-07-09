'use client'

import { useState } from 'react'
import { Check, Lock, User } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BackButton } from '@/components/ui/BackButton'
import { api, getErrorMessage } from '@/lib/api'

export default function ConfiguracoesPage() {
  const { user, refreshUser } = useAuth()
  const [regiao, setRegiao] = useState(user?.regiao || '')
  const [instituicao, setInstituicao] = useState(user?.instituicao || '')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [successPerfil, setSuccessPerfil] = useState(false)
  const [successSenha, setSuccessSenha] = useState(false)
  const [errorPerfil, setErrorPerfil] = useState('')
  const [errorSenha, setErrorSenha] = useState('')
  const [loadingPerfil, setLoadingPerfil] = useState(false)
  const [loadingSenha, setLoadingSenha] = useState(false)

  if (!user) {
    return <div className="text-center py-16 text-on-surface-variant">Precisa de iniciar sessao.</div>
  }

  const guardarPerfil = async () => {
    setLoadingPerfil(true)
    setErrorPerfil('')
    setSuccessPerfil(false)
    try {
      await api.atualizarPerfil({ regiao, instituicao })
      await refreshUser()
      setSuccessPerfil(true)
    } catch (err) {
      setErrorPerfil(getErrorMessage(err))
    } finally {
      setLoadingPerfil(false)
    }
  }

  const alterarSenha = async () => {
    if (novaSenha !== confirmar) {
      setErrorSenha('As palavras-passe nao coincidem.')
      return
    }
    if (novaSenha.length < 8) {
      setErrorSenha('A nova palavra-passe deve ter pelo menos 8 caracteres.')
      return
    }
    setLoadingSenha(true)
    setErrorSenha('')
    setSuccessSenha(false)
    try {
      await api.alterarSenha({ senhaAtual, novaSenha })
      setSuccessSenha(true)
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmar('')
    } catch (err) {
      setErrorSenha(getErrorMessage(err))
    } finally {
      setLoadingSenha(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <header className="space-y-2">
        <BackButton label="Voltar" />
        <h1 className="font-serif text-3xl font-bold text-primary">Configuracoes</h1>
        <p className="text-on-surface-variant">Gerir a sua conta e preferencias.</p>
      </header>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-on-surface">Dados do Perfil</h2>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">E-mail</label>
            <Input value={user.email} disabled className="opacity-60" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Regiao</label>
            <Input value={regiao} onChange={(event) => setRegiao(event.target.value)} placeholder="Ex: Luanda" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Instituicao</label>
            <Input value={instituicao} onChange={(event) => setInstituicao(event.target.value)} placeholder="Ex: ISPTEC" />
          </div>
          {errorPerfil && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{errorPerfil}</p>}
          {successPerfil && (
            <p className="rounded-md bg-secondary/10 p-3 text-sm text-secondary flex items-center gap-2">
              <Check className="w-4 h-4" /> Perfil actualizado com sucesso!
            </p>
          )}
          <Button onClick={guardarPerfil} disabled={loadingPerfil}>
            {loadingPerfil ? 'A guardar...' : 'Guardar Alteracoes'}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-on-surface">Alterar Palavra-passe</h2>
          </div>
          <Input type="password" value={senhaAtual} onChange={(event) => setSenhaAtual(event.target.value)} placeholder="Palavra-passe actual" />
          <Input type="password" value={novaSenha} onChange={(event) => setNovaSenha(event.target.value)} placeholder="Nova palavra-passe" />
          <Input type="password" value={confirmar} onChange={(event) => setConfirmar(event.target.value)} placeholder="Confirmar nova palavra-passe" />
          {errorSenha && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{errorSenha}</p>}
          {successSenha && (
            <p className="rounded-md bg-secondary/10 p-3 text-sm text-secondary flex items-center gap-2">
              <Check className="w-4 h-4" /> Palavra-passe alterada com sucesso!
            </p>
          )}
          <Button onClick={alterarSenha} disabled={loadingSenha || !senhaAtual || !novaSenha || !confirmar}>
            {loadingSenha ? 'A alterar...' : 'Alterar Palavra-passe'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
