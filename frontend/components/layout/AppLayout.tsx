'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BookOpen, Users, Trophy, Settings, LayoutDashboard, LogOut, UserCircle, Bookmark, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/app/contexts/AuthContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { useLanguage } from '@/app/contexts/LanguageContext'

export function AppLayout({ children, isAdmin = false }: { children: React.ReactNode, isAdmin?: boolean }) {
  const pathname = usePathname()
  const { role, user, logout } = useAuth()
  const { t } = useLanguage()

  const navItems = [
    { icon: Home, label: t.navHome, href: '/dashboard' },
    { icon: BookOpen, label: t.navExplore, href: '/conteudo' },
    { icon: Users, label: t.navForums, href: '/comunidade' },
    { icon: Trophy, label: t.navQuizzes, href: '/quiz' },
    { icon: UserCircle, label: t.navProfile, href: '/perfil' },
    { icon: Bookmark, label: t.navSaved, href: '/guardados' },
    ...(role === 'MASTER' ? [{ icon: ShieldCheck, label: t.navAdmin, href: '/admin/sistema' }] : []),
    { icon: Settings, label: t.navSettings, href: '/configuracoes' },
  ]

  let adminItems: Array<{icon: any, label: string, href: string}> = []
  
  if (role === 'MASTER') {
    adminItems = [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
      { icon: BookOpen, label: 'Conteúdos', href: '/admin/conteudos' },
      { icon: Trophy, label: 'Quizzes', href: '/admin/quiz' },
      { icon: Users, label: 'Comunidades', href: '/admin/comunidades' },
      { icon: Users, label: 'Utilizadores', href: '/admin/utilizadores' },
      { icon: Settings, label: 'Configurações', href: '/admin/configuracoes' },
    ]
  } else if (role === 'CRIADOR') {
    adminItems = [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
      { icon: BookOpen, label: 'Conteúdos', href: '/admin/conteudos' },
      { icon: Trophy, label: 'Quizzes', href: '/admin/quiz' },
    ]
  } else if (role === 'REVISOR') {
    adminItems = [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
      { icon: BookOpen, label: 'Conteúdos', href: '/admin/conteudos' },
      { icon: Users, label: 'Comunidades (Moderação)', href: '/admin/comunidades' },
    ]
  }

  const items = isAdmin ? adminItems : navItems

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-primary-container bg-primary text-background px-6 py-6 sticky top-0 h-screen shrink-0 overflow-hidden">
        <div className="mb-6 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 border-2 border-on-primary-container flex items-center justify-center rotate-45 shrink-0">
              <div className="w-4 h-4 bg-on-primary-container"></div>
            </div>
            <h1 className="text-xl font-serif leading-tight italic">Economia com<br/>História</h1>
          </div>
          <p className="text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70">Angola • Digital Hub</p>
        </div>
        
        <nav className="flex-1 min-h-0 space-y-2 overflow-y-auto pr-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary-container text-on-primary-container" 
                    : "text-background hover:bg-primary-container"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        
        <div className="mt-4 shrink-0 pt-4 pb-0 border-t border-primary-container opacity-80">
          {user ? (
            <Link
              href={isAdmin ? "/admin/perfil" : "/perfil"}
              className="flex items-center gap-3 mb-4 text-background hover:text-on-primary-container transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-on-primary-container border-2 border-surface-container-lowest shrink-0"></div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">{user.email}</p>
                <p className="text-[10px] opacity-70 flex items-center gap-1"><Settings className="w-3 h-3" /> {user.role}</p>
              </div>
            </Link>
          ) : (
            <div className="mb-4 space-y-3">
              <div className="text-xs">{t.guest}</div>
              {!isAdmin && (
                <Link href="/" className="block rounded-md bg-secondary px-3 py-2 text-center text-xs font-bold text-surface-container-lowest hover:bg-secondary-container">
                  {t.loginOrCreate}
                </Link>
              )}
            </div>
          )}
          {user && !isAdmin && (
            <div className="bg-secondary p-2 rounded text-center">
              <p className="text-[10px] font-bold tracking-widest uppercase text-surface-container-lowest">{user.pontosAcumulados} pontos</p>
            </div>
          )}
          {user && (
            <button onClick={logout} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-primary-container bg-primary-container/20 px-3 py-3 text-sm font-bold text-background hover:bg-primary-container hover:text-on-primary-container transition-colors">
              <LogOut className="w-4 h-4" /> Terminar sessao
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-sona pointer-events-none"></div>
        <div className="hidden md:flex absolute right-5 top-5 z-20 items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest/95 p-1 shadow-sm">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        {/* Top Header Mobile */}
        <header className="md:hidden flex items-center h-14 px-4 border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-10">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-surface-container-lowest font-serif font-bold text-xs mr-2">
            E
          </div>
          <span className="font-serif font-bold text-primary">Economia com Historia</span>
          <div className="ml-auto flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>
        
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-10 relative z-10 flex flex-col gap-8 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-around z-50 px-2 pb-safe">
        {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive && "fill-primary/20")} />
                <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
              </Link>
            )
          })}
      </nav>
    </div>
  )
}
