import { AppLayout } from '@/components/layout/AppLayout'
import { BloqueioAlert } from '@/components/ui/BloqueioAlert'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout>
      <BloqueioAlert />
      {children}
    </AppLayout>
  )
}
