import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { DashboardClient } from './dashboard-client'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardClient />
    </DashboardLayout>
  )
}
