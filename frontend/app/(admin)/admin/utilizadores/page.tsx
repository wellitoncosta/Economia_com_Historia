'use client'

import { useState } from 'react'
import { ShieldOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { api, getErrorMessage } from '@/lib/api'
import type { Role, Utilizador } from '@/lib/types'

const roles: Role[] = ['VISITANTE', 'INSCRITO', 'CRIADOR', 'REVISOR', 'MASTER']

export default function UtilizadoresAdminPage() {
  const [id, setId] = useState('')
  const [role, setRole] = useState<Role>('INSCRITO')
  const [user, setUser] = useState<Utilizador | null>(null)
  const [error, setError] = useState('')

  const loadUser = async () => {
    setError('')
    try {
      setUser(await api.usuario(id))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const changeRole = async () => {
    if (!user) return
    setError('')
    try {
      setUser(await api.alterarRole(user.id, role))
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-primary">Gestao de Utilizadores</h1>
        <p className="text-sm text-on-surface-variant">{'// TODO: backend nao expoe listagem geral de utilizadores.'}</p>
      </header>
      {error && <p className="rounded-md bg-error/10 p-4 text-sm text-error">{error}</p>}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Input value={id} onChange={(event) => setId(event.target.value)} placeholder="ID do utilizador" />
            <Button onClick={loadUser} disabled={!id}>Buscar</Button>
          </div>
          {user && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Regiao</TableHead>
                    <TableHead>Instituicao</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.pontosAcumulados}</TableCell>
                    <TableCell>{user.regiao || '-'}</TableCell>
                    <TableCell>{user.instituicao || '-'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="flex flex-col md:flex-row gap-3">
                <select value={role} onChange={(event) => setRole(event.target.value as Role)} className="h-10 rounded-md border border-outline bg-surface-container-lowest px-3">
                  {roles.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <Button onClick={changeRole}>Alterar role</Button>
              </div>
              {role === 'VISITANTE' && (
                <p className="text-xs text-error bg-error/10 border border-error/20 rounded-lg px-3 py-2 flex items-center gap-1.5">
                  <ShieldOff className="w-3.5 h-3.5 shrink-0" />
                  Atencao: definir como VISITANTE bloqueia o utilizador. Nao podera comentar, votar nem criar conteudo.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
