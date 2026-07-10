'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function BackButton({ label = 'Voltar', href }: { label?: string; href?: string }) {
  const router = useRouter()

  if (href) {
    return (
      <Button type="button" variant="outline" size="sm" asChild>
        <Link href={href}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {label}
        </Link>
      </Button>
    )
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={() => router.back()}>
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )
}
