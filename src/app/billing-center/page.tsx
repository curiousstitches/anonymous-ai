import AppLayout from '@/components/AppLayout';
import BillingStudio from '@/components/studio/BillingStudio';

export const dynamic = 'force-dynamic';

export default function BillingCenterPage() {
  return (
    <AppLayout>
      <BillingStudio />
    </AppLayout>
  );
}
