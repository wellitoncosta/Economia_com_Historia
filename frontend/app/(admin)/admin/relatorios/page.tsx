'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RelatoriosAdminPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-primary">Relatórios e Analytics</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Engagement</CardTitle></CardHeader>
          <CardContent className="h-64"></CardContent>
        </Card>
      </div>
    </div>
  )
}
