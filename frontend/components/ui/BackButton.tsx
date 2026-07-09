'use client'

import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function BackButton({ label = 'Voltar' }: { label?: string }) {
  const router = useRouter()

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )
}
