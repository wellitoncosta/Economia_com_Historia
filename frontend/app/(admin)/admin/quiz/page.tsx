'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus } from 'lucide-react'
import Link from 'next/link'

export default function QuizAdminPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold text-primary">Gestao de Quiz</h1>
          <p className="text-sm text-on-surface-variant">{'// TODO: backend nao suporta banco de perguntas global; cada pergunta pertence a uma sala especifica.'}</p>
        </div>
        <Button asChild><Link href="/quiz/novo"><Plus className="w-4 h-4 mr-2" /> Nova Sala</Link></Button>
      </header>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <Input className="pl-9 h-10" placeholder="ID da sala para consultar no ecran publico" disabled />
          </div>
          <p className="text-sm text-on-surface-variant">
            Use o fluxo de criacao de sala para adicionar perguntas. A listagem de salas nao existe nos mappings documentados.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
