'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, BookOpen, AlertTriangle, TrendingUp, CheckCircle, PenTool } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '@/app/contexts/AuthContext'

const data = [
  { name: 'Seg', usuarios: 400 },
  { name: 'Ter', usuarios: 300 },
  { name: 'Qua', usuarios: 550 },
  { name: 'Qui', usuarios: 480 },
  { name: 'Sex', usuarios: 700 },
  { name: 'Sáb', usuarios: 850 },
  { name: 'Dom', usuarios: 900 },
]

export default function AdminDashboard() {
  const { role, user } = useAuth()

  // Master Dashboard
  if (role === 'MASTER') {
    return (
      <div className="space-y-8 animate-in fade-in">
        <header className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-primary">Painel Administrativo (Master)</h1>
          <p className="text-on-surface-variant">Visão geral do sistema e curadoria.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Utilizadores Ativos', value: '2,450', icon: Users, trend: '+12% esta semana' },
            { title: 'Artigos Publicados', value: '342', icon: BookOpen, trend: '+3 novos hoje' },
            { title: 'Quizzes Completados', value: '12k', icon: TrendingUp, trend: 'Alto engajamento' },
            { title: 'Denúncias Fórum', value: '4', icon: AlertTriangle, trend: 'Requer moderação', alert: true },
          ].map((stat, i) => (
            <Card key={i} className={stat.alert ? 'border-error/50 bg-error/5' : ''}>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`p-2 rounded-lg ${stat.alert ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-3xl font-bold">{stat.value}</h3>
                  <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">{stat.title}</p>
                  <p className={`text-xs mt-2 font-medium ${stat.alert ? 'text-error' : 'text-secondary'}`}>{stat.trend}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Crescimento Semanal (Utilizadores Ativos)</CardTitle>
            </CardHeader>
            <CardContent className="h-72 w-full pt-4 pr-6 pb-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbc1b8" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#55433c', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#55433c', fontSize: 12 }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #88726b' }}
                    itemStyle={{ color: '#6d2504', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="usuarios" stroke="#a14000" strokeWidth={3} dot={{ r: 4, fill: '#a14000' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
               <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <Button className="w-full justify-start" variant="outline">Aprovar Artigos (2)</Button>
               <Button className="w-full justify-start" variant="outline">Moderar Fórum (4)</Button>
               <Button className="w-full justify-start" variant="secondary">Adicionar Novo Quiz</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Creator Dashboard
  if (role === 'CRIADOR') {
    return (
      <div className="space-y-8 animate-in fade-in">
        <header className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-primary">Painel do Criador</h1>
          <p className="text-on-surface-variant">Bem-vindo, {user?.email}. Acompanhe o impacto do seu conteúdo.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary w-min">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold">42</h3>
                <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Meus Artigos</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary w-min">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold">18.4k</h3>
                <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Total de Visualizações</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary w-min">
                <PenTool className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold">3</h3>
                <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Em Rascunho / Revisão</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
             <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
             <Button variant="secondary">Novo Artigo</Button>
             <Button variant="outline">Novo Quiz</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Moderator Dashboard
  if (role === 'REVISOR') {
    return (
      <div className="space-y-8 animate-in fade-in">
        <header className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-primary">Painel de Moderação</h1>
          <p className="text-on-surface-variant">Curadoria de conteúdos e saúde da comunidade.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-3xl font-bold text-primary">12</h3>
                  <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Artigos Pendentes</p>
                </div>
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
              <Button className="w-full" variant="outline">Ir para Fila de Aprovação</Button>
            </CardContent>
          </Card>

          <Card className="border-error/50 bg-error/5">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-3xl font-bold text-error">7</h3>
                  <p className="text-sm font-semibold text-error uppercase tracking-wider">Denúncias no Fórum</p>
                </div>
                <div className="p-3 rounded-full bg-error/10 text-error">
                  <AlertTriangle className="w-8 h-8" />
                </div>
              </div>
              <Button className="w-full text-error border-error hover:bg-error hover:text-white" variant="outline">Moderar Fórum</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Fallback if not admin
  return (
    <div className="p-8 text-center text-on-surface-variant">
      Acesso Negado. Esta área é restrita a administradores.
    </div>
  )
}
