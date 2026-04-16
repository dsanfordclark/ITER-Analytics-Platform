import { AdminLayout } from '@/components/layout/admin-layout'
import { AdminDashboardClient } from './dashboard-client'

export const metadata = {
  title: 'Dashboard | ITER Admin',
}

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <AdminDashboardClient />
    </AdminLayout>
  )
}
