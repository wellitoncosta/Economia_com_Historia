import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-surface">
      <h2 className="font-serif text-4xl text-primary font-bold">404 - Não Encontrado</h2>
      <p className="mt-4 text-on-surface-variant">A página que procura não existe.</p>
      <Link href="/" className="mt-8 px-4 py-2 bg-primary text-surface-container-lowest rounded-md">
        Voltar à página principal
      </Link>
    </div>
  )
}
