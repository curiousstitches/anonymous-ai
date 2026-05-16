import AppLayout from '@/components/AppLayout';
import AdminApiUsage from './components/AdminApiUsage';

export const dynamic = 'force-dynamic';

export default function AdminApiUsagePage() {
  return (
    <AppLayout>
      <AdminApiUsage />
    </AppLayout>
  );
}
