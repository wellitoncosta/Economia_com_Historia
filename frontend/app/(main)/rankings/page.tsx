'use client'

import { useEffect, useState } from 'react'
import { Trophy } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { BackButton } from '@/components/ui/BackButton'
import { api } from '@/lib/api'
import type { RankingAgregado } from '@/lib/types'

export default function RankingsPage() {
  const [regioes, setRegioes] = useState<RankingAgregado[]>([])
  const [instituicoes, setInstituicoes] = useState<RankingAgregado[]>([])

  useEffect(() => {
    api.rankingRegioes().then(setRegioes).catch(() => setRegioes([]))
    api.rankingInstituicoes().then(setInstituicoes).catch(() => setInstituicoes([]))
  }, [])

  const renderList = (items: RankingAgregado[]) => (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={`${item.chave}-${index}`} className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-lowest p-3">
          <span className="flex items-center gap-3 text-sm font-semibold text-on-surface">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-surface-container-lowest text-xs">{index + 1}</span>
            {item.chave || 'Sem dados'}
          </span>
          <span className="font-mono text-sm font-bold text-primary">{item.pontos} pts</span>
        </div>
      ))}
      {items.length === 0 && <p className="text-sm text-on-surface-variant">Sem dados de ranking por enquanto.</p>}
    </div>
  )

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <BackButton label="Voltar" />
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-primary flex items-center gap-3">
          <Trophy className="w-8 h-8 text-secondary" />
          Rankings
        </h1>
        <p className="text-on-surface-variant">Acompanhe os melhores desempenhos por regiao e instituicao.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-primary">Por regiao</h2>
            {renderList(regioes)}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-4">
            <h2 className="font-serif text-2xl font-bold text-primary">Por instituicao</h2>
            {renderList(instituicoes)}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
