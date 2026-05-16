import AppLayout from '@/components/AppLayout';
import PricingStudio from '@/components/studio/PricingStudio';

export const dynamic = 'force-dynamic';

export default function PricingPage() {
  return (
    <AppLayout>
      <PricingStudio />
    </AppLayout>
  );
}
