import AppLayout from '@/components/AppLayout';
import AdminEventLog from './components/AdminEventLog';

export const dynamic = 'force-dynamic';

export default function AdminEventLogPage() {
  return (
    <AppLayout>
      <AdminEventLog />
    </AppLayout>
  );
}
