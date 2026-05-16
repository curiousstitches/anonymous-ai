import AppLayout from '@/components/AppLayout';
import ProvidersStudio from '@/components/studio/ProvidersStudio';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <AppLayout>
      <ProvidersStudio />
    </AppLayout>
  );
}
