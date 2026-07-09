'use client'

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Chip } from '@/components/ui/chip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, Plus, Filter, Eye, CheckCircle, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { api, contentTypeLabel, getErrorMessage } from '@/lib/api'
import { useAuth } from '@/app/contexts/AuthContext'
import { hasAnyRole } from '@/lib/auth'
import type { Conteudo } from '@/lib/types'

export default function ConteudosAdminPage() {
  const { role } = useAuth()
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState<Conteudo | null>(null)
  const [items, setItems] = useState<Conteudo[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const canCreate = hasAnyRole(role, ['CRIADOR', 'REVISOR', 'MASTER'])
  const canReview = hasAnyRole(role, ['REVISOR', 'MASTER'])

  const load = () => {
    setLoading(true)
    setError('')
    api.conteudos()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((item) => [item.titulo, item.categoria, item.autorId].some((value) => value.toLowerCase().includes(query)))
  }, [items, search])

  const approve = async (approved: boolean) => {
    if (!selectedContent) return
    setError('')
    try {
      await api.aprovarConteudo(selectedContent.id, approved)
      setReviewModalOpen(false)
      setSelectedContent(null)
      load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-serif text-3xl font-bold text-primary">Gestao de Conteudos</h1>
          <p className="text-on-surface-variant">Curadoria e aprovacao do acervo da plataforma.</p>
        </div>
        {canCreate && (
          <Button asChild>
            <Link href="/admin/conteudos/novo"><Plus className="w-4 h-4 mr-2" /> Novo Conteudo</Link>
          </Button>
        )}
      </header>

      {error && <p className="rounded-md bg-error/10 p-4 text-sm text-error">{error}</p>}

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row gap-4 justify-between items-center bg-surface-container-lowest">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9 h-10" placeholder="Pesquisar por titulo, categoria ou autor..." />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto"><Filter className="w-4 h-4 mr-2" /> Filtros</Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titulo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-primary">{item.titulo}</TableCell>
                  <TableCell>{contentTypeLabel(item.tipo)}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>{item.autorId.slice(0, 8)}</TableCell>
                  <TableCell>
                    <Chip variant={item.approved ? 'primary' : 'secondary'}>
                      {item.approved ? 'Publicado' : 'Em Revisao'}
                    </Chip>
                  </TableCell>
                  <TableCell className="text-on-surface-variant">{new Date(item.dataCriacao).toLocaleDateString('pt-AO')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {!item.approved && canReview && (
                        <Button variant="outline" size="sm" onClick={() => { setSelectedContent(item); setReviewModalOpen(true); }}>
                          Revisar
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" title="Ver" asChild><Link href={`/conteudo/${item.id}`}><Eye className="w-4 h-4" /></Link></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-4 border-t border-outline-variant flex items-center justify-between text-sm text-on-surface-variant">
            <span>{loading ? 'A carregar conteudos...' : `Mostrando ${filtered.length} conteudos`}</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revisar Conteudo</DialogTitle>
            <DialogDescription>
              {selectedContent?.titulo} ({selectedContent ? contentTypeLabel(selectedContent.tipo) : ''})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-surface-container rounded-md">
              <p className="text-sm font-medium mb-2">Resumo da submissao:</p>
              <ul className="text-sm text-on-surface-variant space-y-1">
                <li><strong>Autor:</strong> {selectedContent?.autorId}</li>
                <li><strong>Categoria:</strong> {selectedContent?.categoria}</li>
                <li><strong>Tags:</strong> {selectedContent?.tags?.join(', ') || 'Sem tags'}</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setReviewModalOpen(false)}>Cancelar</Button>
            <Button variant="outline" className="text-error border-error hover:bg-error/10 hover:text-error" onClick={() => approve(false)}><XCircle className="w-4 h-4 mr-2" /> Rejeitar</Button>
            <Button variant="default" className="bg-primary text-surface-container-lowest" onClick={() => approve(true)}><CheckCircle className="w-4 h-4 mr-2" /> Aprovar e Publicar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
