'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, KeyRound, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { api, getErrorMessage } from '@/lib/api'

type Step = 'email' | 'codigo' | 'senha' | 'sucesso'

export default function RecuperarPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [novaSenha, setNovaSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const solicitar = async () => {
    setLoading(true)
    setError('')
    setInfo('')
    try {
      const response = await api.solicitarRecuperacao(email)
      setInfo(response.mensagem)
      setStep('codigo')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const validar = async () => {
    setLoading(true)
    setError('')
    setInfo('')
    try {
      await api.validarOtp(email, codigo)
      setStep('senha')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const redefinir = async () => {
    if (novaSenha !== confirmar) {
      setError('As palavras-passe nao coincidem.')
      return
    }
    setLoading(true)
    setError('')
    setInfo('')
    try {
      await api.redefinirSenha(email, codigo, novaSenha)
      setStep('sucesso')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center text-surface-container-lowest font-serif font-bold text-3xl">E</div>
          <h1 className="font-serif text-2xl font-bold text-primary">Recuperar Conta</h1>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            {step === 'email' && (
              <>
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Introduza o seu e-mail para receber o codigo</span>
                </div>
                <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="o-seu@email.ao" type="email" />
                {error && <p className="text-sm text-error bg-error/10 p-3 rounded-md">{error}</p>}
                {info && <p className="text-sm text-secondary bg-secondary/10 p-3 rounded-md">{info}</p>}
                <Button className="w-full" onClick={solicitar} disabled={loading || !email}>
                  {loading ? 'A enviar...' : 'Enviar Codigo'}
                </Button>
              </>
            )}

            {step === 'codigo' && (
              <>
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <KeyRound className="w-4 h-4" />
                  <span className="text-sm">Introduza o codigo de 6 digitos enviado para {email}</span>
                </div>
                <Input value={codigo} onChange={(event) => setCodigo(event.target.value)} placeholder="000000" maxLength={6} className="text-center text-2xl tracking-[0.5em] font-mono" />
                {error && <p className="text-sm text-error bg-error/10 p-3 rounded-md">{error}</p>}
                {info && <p className="text-sm text-secondary bg-secondary/10 p-3 rounded-md">{info}</p>}
                <Button className="w-full" onClick={validar} disabled={loading || codigo.length < 6}>
                  {loading ? 'A validar...' : 'Validar Codigo'}
                </Button>
                <button onClick={() => setStep('email')} className="text-xs text-on-surface-variant hover:text-primary w-full text-center">
                  Nao recebi o codigo - tentar novamente
                </button>
              </>
            )}

            {step === 'senha' && (
              <>
                <div className="flex items-center gap-2 text-on-surface-variant mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">Defina a sua nova palavra-passe</span>
                </div>
                <Input type="password" value={novaSenha} onChange={(event) => setNovaSenha(event.target.value)} placeholder="Nova palavra-passe" />
                <Input type="password" value={confirmar} onChange={(event) => setConfirmar(event.target.value)} placeholder="Confirmar palavra-passe" />
                {error && <p className="text-sm text-error bg-error/10 p-3 rounded-md">{error}</p>}
                <Button className="w-full" onClick={redefinir} disabled={loading || !novaSenha}>
                  {loading ? 'A redefinir...' : 'Redefinir Palavra-passe'}
                </Button>
              </>
            )}

            {step === 'sucesso' && (
              <div className="text-center space-y-4">
                <p className="text-secondary font-semibold">Palavra-passe redefinida com sucesso!</p>
                <Button className="w-full" onClick={() => router.push('/')}>Ir para o Login</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Link href="/" className="text-sm text-on-surface-variant hover:text-primary flex items-center justify-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Voltar ao login
        </Link>
      </div>
    </div>
  )
}


