'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ConfiguracoesAdminPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-primary">Configurações</h1>
      </header>
      <Card>
        <CardHeader><CardTitle>Segurança</CardTitle></CardHeader>
        <CardContent className="h-64"></CardContent>
      </Card>
    </div>
  )
}
