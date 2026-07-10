'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'motion/react'
import { Book, Users, Target } from 'lucide-react'
import { useAuth } from './contexts/AuthContext'
import { getErrorMessage } from '@/lib/api'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { useLanguage } from './contexts/LanguageContext'

export default function SplashPage() {
  const router = useRouter()
  const { login, register } = useAuth()
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [regiao, setRegiao] = useState('')
  const [instituicao, setInstituicao] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onboardingSteps = [
    {
      title: 'Explorar a Memoria',
      desc: 'Artigos, videos e podcasts sobre a evolucao economica de Angola, com rigor e profundidade.',
      icon: Book,
    },
    {
      title: 'Debater e Aprender',
      desc: 'Comunidade ativa para estudantes e especialistas. Participe na nossa academia digital.',
      icon: Users,
    },
    {
      title: 'Testar Conhecimento',
      desc: 'Quizzes interativos e feedback imediato. Conquiste o titulo de Mestre de Sona.',
      icon: Target,
    }
  ]

  const submitAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register({
          email,
          password,
          regiao: regiao || undefined,
          instituicao: instituicao || undefined,
        })
      }
      router.push('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-surface flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-sona z-0"></div>
      <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-xl border border-outline-variant bg-surface-container-lowest/90 p-1 shadow-sm">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="splash"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="w-24 h-24 mx-auto rounded-2xl bg-primary flex items-center justify-center text-surface-container-lowest font-serif font-bold text-5xl shadow-lg">
                E
              </div>
              <div className="space-y-4">
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-tight">
                  {t.splashTitle}
                </h1>
                <p className="text-on-surface-variant text-lg">{t.splashCountry}</p>
                <div className="pt-4 flex justify-center">
                  <div className="w-16 h-1 bg-outline-variant"></div>
                </div>
              </div>
              <div className="pt-8 space-y-4">
                <Button size="lg" className="w-full text-lg" onClick={() => setStep(1)}>
                  {t.startExploration}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => {
                  setMode('login')
                  setStep(4)
                }}>
                  {t.alreadyAccount}
                </Button>
                <Button variant="outline" className="w-full text-sm border-primary/30 bg-surface-container-lowest/70 font-semibold" onClick={() => router.push('/dashboard')}>
                  {t.exploreGuest}
                </Button>
              </div>
            </motion.div>
          )}

          {step > 0 && step < 4 && (
            <motion.div
              key={`onboarding-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center space-y-8"
            >
              <div className="w-32 h-32 mx-auto rounded-full bg-surface-container flex items-center justify-center text-primary relative">
                <div className="absolute inset-0 border border-outline-variant rounded-full scale-[1.15]"></div>
                {(() => {
                  const Icon = onboardingSteps[step - 1].icon
                  return <Icon className="w-12 h-12" />
                })()}
              </div>
              <div className="space-y-4">
                <h2 className="font-serif text-3xl font-bold text-primary">
                  {onboardingSteps[step - 1].title}
                </h2>
                <p className="text-on-surface-variant">
                  {onboardingSteps[step - 1].desc}
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-primary' : 'w-2 bg-outline-variant'}`} />
                ))}
              </div>
              <div className="pt-8">
                <Button size="lg" className="w-full" onClick={() => {
                  if (step === 3) setMode('register')
                  setStep(step + 1)
                }}>
                  {step === 3 ? 'Criar Conta' : 'Avancar'}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <Card className="w-full">
                <CardContent className="pt-8 space-y-6">
                  <Button type="button" variant="ghost" size="sm" className="-ml-2" onClick={() => setStep(0)}>
                    Voltar
                  </Button>
                  <div className="text-center space-y-2">
                    <h2 className="font-serif text-2xl font-bold text-primary">{mode === 'login' ? t.welcome : t.createAccountTitle}</h2>
                    <p className="text-sm text-on-surface-variant">{t.accountAccess}</p>
                  </div>

                  <form className="space-y-4" onSubmit={submitAuth}>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t.email}</label>
                      <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="estudante@isptec.co.ao" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t.password}</label>
                      <Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="********" />
                    </div>
                    {mode === 'register' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t.region}</label>
                          <Input value={regiao} onChange={(event) => setRegiao(event.target.value)} placeholder="Luanda" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{t.institution}</label>
                          <Input value={instituicao} onChange={(event) => setInstituicao(event.target.value)} placeholder="ISPTEC" />
                        </div>
                      </>
                    )}
                    {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}
                    <Button size="lg" className="w-full mt-4" type="submit" disabled={submitting}>
                      {submitting ? t.processing : mode === 'login' ? t.enter : t.register}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setError('')
                        setMode(mode === 'login' ? 'register' : 'login')
                      }}
                    >
                      {mode === 'login' ? t.createAccount : t.alreadyAccount}
                    </Button>
                    {mode === 'login' && (
                      <div className="text-center">
                        <Link href="/recuperar" className="text-xs text-on-surface-variant hover:text-primary">
                          {t.forgotPassword}
                        </Link>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
