import React from 'react';
import AppLayout from '@/components/AppLayout';
import UsageDashboard from './components/UsageDashboard';

export const dynamic = 'force-dynamic';

export default function UsageDashboardPage() {
  return (
    <AppLayout>
      <UsageDashboard />
    </AppLayout>
  );
}