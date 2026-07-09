'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NovaPerguntaPage() {
  const router = useRouter()

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="font-serif text-3xl font-bold text-primary">Nova Pergunta</h1>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-4">
          <p className="text-sm text-on-surface-variant">
            {'// TODO: backend nao suporta banco de perguntas global. Crie perguntas dentro de uma sala em /quiz/novo.'}
          </p>
          <Button onClick={() => router.push('/quiz/novo')}>Criar sala com perguntas</Button>
        </CardContent>
      </Card>
    </div>
  )
}
