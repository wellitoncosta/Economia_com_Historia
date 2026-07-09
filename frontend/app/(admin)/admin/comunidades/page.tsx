'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { api, getErrorMessage } from '@/lib/api'
import type { Forum, PapelForum } from '@/lib/types'

export default function ComunidadesAdminPage() {
  const [foruns, setForuns] = useState<Forum[]>([])
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [utilizadorId, setUtilizadorId] = useState('')
  const [papel, setPapel] = useState<PapelForum>('MEMBRO')
  const [selectedForum, setSelectedForum] = useState('')
  const [membroId, setMembroId] = useState('')
  const [error, setError] = useState('')

  const load = () => {
    api.foruns().then(setForuns).catch((err) => setError(getErrorMessage(err)))
  }

  useEffect(load, [])

  const createForum = async () => {
    setError('')
    try {
      await api.criarForum({ nome, descricao, privado: false })
      setNome('')
      setDescricao('')
      load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const addMember = async () => {
    if (!selectedForum) return
    setError('')
    try {
      await api.addMembro(selectedForum, { utilizadorId, papel })
      setUtilizadorId('')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const suspendSpeech = async () => {
    if (!selectedForum || !membroId) return
    setError('')
    try {
      await api.alterarFala(selectedForum, membroId, { podeFalar: false })
      setMembroId('')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl font-bold text-primary">Comunidades e Moderacao</h1>
      </header>

      {error && <p className="rounded-md bg-error/10 p-4 text-sm text-error">{error}</p>}

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary">Criar forum</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Nome do forum" />
            <Input value={descricao} onChange={(event) => setDescricao(event.target.value)} placeholder="Descricao" />
            <Button onClick={createForum}><Plus className="w-4 h-4 mr-2" /> Criar Forum</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Dono</TableHead>
                <TableHead>Privado</TableHead>
                <TableHead>Limite</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foruns.map((forum) => (
                <TableRow key={forum.id} onClick={() => setSelectedForum(forum.id)} className="cursor-pointer">
                  <TableCell className="font-medium text-primary">{forum.nome}</TableCell>
                  <TableCell>{forum.donoId.slice(0, 8)}</TableCell>
                  <TableCell>{forum.privado ? 'Sim' : 'Nao'}</TableCell>
                  <TableCell>{forum.limiteUtilizadores || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-serif text-xl font-bold text-primary">Gerir membros</h2>
          <select value={selectedForum} onChange={(event) => setSelectedForum(event.target.value)} className="w-full h-10 rounded-md border border-outline bg-surface-container-lowest px-3">
            <option value="">Selecionar forum</option>
            {foruns.map((forum) => <option key={forum.id} value={forum.id}>{forum.nome}</option>)}
          </select>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input value={utilizadorId} onChange={(event) => setUtilizadorId(event.target.value)} placeholder="ID do utilizador" />
            <select value={papel} onChange={(event) => setPapel(event.target.value as PapelForum)} className="h-10 rounded-md border border-outline bg-surface-container-lowest px-3">
              <option value="MEMBRO">MEMBRO</option>
              <option value="MODERADOR">MODERADOR</option>
              <option value="DONO">DONO</option>
            </select>
            <Button onClick={addMember}>Adicionar membro</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input value={membroId} onChange={(event) => setMembroId(event.target.value)} placeholder="ID do membro" />
            <Button variant="outline" onClick={suspendSpeech}>Suspender fala</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
