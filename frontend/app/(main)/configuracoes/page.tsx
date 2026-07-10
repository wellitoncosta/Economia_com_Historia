'use client'

import { useState } from 'react'
import { Building, Check, Eye, EyeOff, Lock, LogOut, Mail, MapPin, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BackButton } from '@/components/ui/BackButton'
import { api, getErrorMessage } from '@/lib/api'

function FieldRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      {children}
    </div>
  )
}

function SectionCard({ icon: Icon, title, subtitle, children }: { icon: React.ElementType; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6 space-y-5">
        <div className="flex items-start gap-3 pb-4 border-b border-outline-variant">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-on-surface">{title}</h2>
            {subtitle && <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

export default function ConfiguracoesPage() {
  const { user, refreshUser, logout } = useAuth()
  const [regiao, setRegiao] = useState(user?.regiao || '')
  const [instituicao, setInstituicao] = useState(user?.instituicao || '')
  const [loadingPerfil, setLoadingPerfil] = useState(false)
  const [successPerfil, setSuccessPerfil] = useState(false)
  const [errorPerfil, setErrorPerfil] = useState('')
  const [senhaAtual, setSenhaAtual] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [showSenhaAtual, setShowSenhaAtual] = useState(false)
  const [showNovaSenha, setShowNovaSenha] = useState(false)
  const [loadingSenha, setLoadingSenha] = useState(false)
  const [successSenha, setSuccessSenha] = useState(false)
  const [errorSenha, setErrorSenha] = useState('')

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
      setTimeout(() => setSuccessPerfil(false), 3000)
    } catch (err) {
      setErrorPerfil(getErrorMessage(err))
    } finally {
      setLoadingPerfil(false)
    }
  }

  const alterarSenha = async () => {
    setErrorSenha('')
    if (novaSenha !== confirmar) {
      setErrorSenha('As palavras-passe nao coincidem.')
      return
    }
    if (novaSenha.length < 8) {
      setErrorSenha('A nova palavra-passe deve ter pelo menos 8 caracteres.')
      return
    }
    setLoadingSenha(true)
    setSuccessSenha(false)
    try {
      await api.alterarSenha({ senhaAtual, novaSenha })
      setSuccessSenha(true)
      setSenhaAtual('')
      setNovaSenha('')
      setConfirmar('')
      setTimeout(() => setSuccessSenha(false), 4000)
    } catch (err) {
      setErrorSenha(getErrorMessage(err))
    } finally {
      setLoadingSenha(false)
    }
  }

  const forca = novaSenha.length === 0 ? null
    : novaSenha.length < 8 ? 'fraca'
    : /[A-Z]/.test(novaSenha) && /[0-9]/.test(novaSenha) && novaSenha.length >= 10 ? 'forte'
    : 'media'
  const forcaConfig = {
    fraca: { label: 'Fraca', color: 'bg-error', width: 'w-1/3' },
    media: { label: 'Media', color: 'bg-secondary', width: 'w-2/3' },
    forte: { label: 'Forte', color: 'bg-primary', width: 'w-full' },
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-10">
      <div className="space-y-1">
        <BackButton label="Voltar ao Perfil" href="/perfil" />
        <h1 className="font-serif text-3xl font-bold text-primary">Configuracoes</h1>
        <p className="text-sm text-on-surface-variant">Gerir a sua conta e preferencias pessoais.</p>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-surface-container-lowest font-bold font-serif text-lg shrink-0">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-on-surface truncate">{user.email}</p>
          <p className="text-xs text-on-surface-variant">{user.role} - {user.pontosAcumulados} pontos</p>
        </div>
      </div>

      <SectionCard icon={Mail} title="Dados do Perfil" subtitle="Actualize a sua regiao e instituicao.">
        <FieldRow icon={Mail} label="E-mail">
          <Input value={user.email} disabled className="opacity-50 cursor-not-allowed" />
        </FieldRow>
        <FieldRow icon={MapPin} label="Regiao">
          <Input value={regiao} onChange={(event) => setRegiao(event.target.value)} placeholder="Ex: Luanda" />
        </FieldRow>
        <FieldRow icon={Building} label="Instituicao">
          <Input value={instituicao} onChange={(event) => setInstituicao(event.target.value)} placeholder="Ex: ISPTEC" />
        </FieldRow>
        {errorPerfil && <p className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">{errorPerfil}</p>}
        {successPerfil && (
          <p className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-primary flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" /> Perfil actualizado com sucesso.
          </p>
        )}
        <Button onClick={guardarPerfil} disabled={loadingPerfil} className="w-full sm:w-auto">
          {loadingPerfil ? 'A guardar...' : 'Guardar Alteracoes'}
        </Button>
      </SectionCard>

      <SectionCard icon={Lock} title="Palavra-passe" subtitle="Use uma senha forte com letras, numeros e simbolos.">
        <FieldRow icon={Lock} label="Palavra-passe actual">
          <div className="relative">
            <Input type={showSenhaAtual ? 'text' : 'password'} value={senhaAtual} onChange={(event) => setSenhaAtual(event.target.value)} placeholder="********" className="pr-10" />
            <button type="button" onClick={() => setShowSenhaAtual((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
              {showSenhaAtual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FieldRow>
        <FieldRow icon={Lock} label="Nova palavra-passe">
          <div className="relative">
            <Input type={showNovaSenha ? 'text' : 'password'} value={novaSenha} onChange={(event) => setNovaSenha(event.target.value)} placeholder="Minimo 8 caracteres" className="pr-10" />
            <button type="button" onClick={() => setShowNovaSenha((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
              {showNovaSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {forca && (
            <div className="mt-1.5 space-y-1">
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${forcaConfig[forca].color} ${forcaConfig[forca].width}`} />
              </div>
              <p className={`text-xs font-medium ${forca === 'forte' ? 'text-primary' : forca === 'media' ? 'text-secondary' : 'text-error'}`}>
                Forca: {forcaConfig[forca].label}
              </p>
            </div>
          )}
        </FieldRow>
        <FieldRow icon={Lock} label="Confirmar nova palavra-passe">
          <Input type="password" value={confirmar} onChange={(event) => setConfirmar(event.target.value)} placeholder="Repetir nova palavra-passe" className={confirmar && confirmar !== novaSenha ? 'border-error' : ''} />
          {confirmar && confirmar !== novaSenha && <p className="text-xs text-error mt-1">As palavras-passe nao coincidem.</p>}
        </FieldRow>
        {errorSenha && <p className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error">{errorSenha}</p>}
        {successSenha && (
          <p className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-primary flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" /> Palavra-passe alterada com sucesso.
          </p>
        )}
        <Button onClick={alterarSenha} disabled={loadingSenha || !senhaAtual || !novaSenha || !confirmar} className="w-full sm:w-auto">
          {loadingSenha ? 'A alterar...' : 'Alterar Palavra-passe'}
        </Button>
      </SectionCard>

      <Card className="border-error/20">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-error" />
            </div>
            <div>
              <h2 className="font-semibold text-error">Zona de Perigo</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">Accoes que terminam a sessao neste dispositivo.</p>
            </div>
          </div>
          <div className="border-t border-outline-variant pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-on-surface">Terminar sessao</p>
                <p className="text-xs text-on-surface-variant">Sair da sua conta neste dispositivo.</p>
              </div>
              <Button variant="outline" className="border-error/40 text-error hover:bg-error/10 hover:border-error gap-2 shrink-0" onClick={logout}>
                <LogOut className="w-4 h-4" /> Terminar Sessao
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
