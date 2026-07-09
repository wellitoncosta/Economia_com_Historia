'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, Trophy, BookOpen, Video, Mic } from 'lucide-react'
import Link from 'next/link'
import { api, contentTypeLabel } from '@/lib/api'
import { useAuth } from '@/app/contexts/AuthContext'
import { useLanguage } from '@/app/contexts/LanguageContext'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { RankingAgregado, Recomendacao } from '@/lib/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([])
  const [regioes, setRegioes] = useState<RankingAgregado[]>([])

  useEffect(() => {
    api.rankingRegioes().then(setRegioes).catch(() => setRegioes([]))
  }, [])

  useEffect(() => {
    if (!user) return
    api.recomendacoes().then(setRecomendacoes).catch(() => setRecomendacoes([]))
  }, [user])

  const destaque = recomendacoes[0]?.conteudo

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-end gap-1 md:hidden">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {!user && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
          <p className="text-sm text-on-surface-variant">Entre ou crie uma conta para guardar progresso, pontos e preferencias.</p>
          <Button asChild>
            <Link href="/">{t.loginOrCreate}</Link>
          </Button>
        </div>
      )}

      <section className="relative h-48 rounded-2xl bg-primary text-background flex items-center px-6 md:px-12 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-sona opacity-40"></div>
        <div className="z-10 w-full md:w-2/3">
          <span className="bg-secondary text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded mb-4 inline-block text-surface-container-lowest">{t.recommended}</span>
          <h2 className="font-serif text-3xl md:text-4xl mb-2 text-surface-container-lowest">{destaque?.titulo || t.publicArchiveTitle}</h2>
          <p className="text-sm opacity-80 max-w-md text-surface-container-lowest">{destaque?.descricao || t.publicArchiveText}</p>
        </div>
        <div className="absolute right-6 md:right-12 bottom-0 hidden md:block">
          <Button variant="secondary" className="bg-surface-container-lowest text-primary rounded-t-lg rounded-b-none font-bold text-sm hover:bg-on-primary-container h-12 px-6" asChild>
            <Link href={destaque ? `/conteudo/${destaque.id}` : '/conteudo'}>{t.startReading}</Link>
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        <div className="lg:col-span-8 space-y-8">
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
              <span className="w-4 h-[1px] bg-secondary"></span> {t.recommendations}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recomendacoes.map((item) => (
                <Link key={item.conteudo.id} href={`/conteudo/${item.conteudo.id}`}>
                  <Card className="group h-full overflow-hidden hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="relative h-48 w-full overflow-hidden bg-primary-container text-on-primary-container p-5 flex flex-col justify-between">
                      <div className="absolute inset-0 bg-sona opacity-20"></div>
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex gap-2">
                          <Chip variant="secondary">{contentTypeLabel(item.conteudo.tipo)}</Chip>
                          <Chip>{item.conteudo.categoria}</Chip>
                        </div>
                        {item.conteudo.tipo === 'TEXTO' && <BookOpen className="w-8 h-8 opacity-80" />}
                        {item.conteudo.tipo === 'VIDEO' && <Video className="w-8 h-8 opacity-80" />}
                        {item.conteudo.tipo === 'AUDIO' && <Mic className="w-8 h-8 opacity-80" />}
                      </div>
                      <div className="relative z-10">
                        <p className="text-xs uppercase tracking-widest font-semibold opacity-80">Da base de dados</p>
                        <p className="font-serif text-xl font-bold line-clamp-2">{item.conteudo.titulo}</p>
                      </div>
                    </div>
                    <CardContent className="pt-6 space-y-4">
                      <h2 className="font-serif text-2xl font-bold text-primary group-hover:text-secondary transition-colors">
                        {item.conteudo.titulo}
                      </h2>
                      <p className="text-on-surface-variant line-clamp-2">{item.motivo}</p>
                      <div className="flex items-center text-sm text-on-surface-variant font-medium pt-2 border-t border-outline-variant">
                        <Clock className="w-4 h-4 mr-2" />
                        {new Date(item.conteudo.dataCriacao).toLocaleDateString('pt-AO')}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {user && recomendacoes.length === 0 && <p className="text-sm text-on-surface-variant">{t.noRecommendations}</p>}
            {!user && <p className="text-sm text-on-surface-variant">{t.personalizedRecommendations}</p>}
          </section>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container p-6 rounded-xl border border-outline flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
              {t.rankingByRegion} <span className="flex-1 h-[1px] bg-primary/20"></span>
            </h3>
            <div className="space-y-3">
              {regioes.slice(0, 5).map((item, index) => (
                <div key={item.chave} className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-on-surface-variant flex items-center gap-2"><Trophy className="w-3 h-3" /> {index + 1}. {item.chave}</span>
                  <span className="text-primary font-bold">{item.pontos} pts</span>
                </div>
              ))}
              {regioes.length === 0 && <p className="text-sm text-on-surface-variant">{t.rankingUnavailable}</p>}
            </div>
            <Button className="w-full mt-6" asChild>
              <Link href="/quiz">{t.goToQuizzes} <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

