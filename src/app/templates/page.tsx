import AppLayout from '@/components/AppLayout';
import TemplatesStudio from '@/components/studio/TemplatesStudio';

export const dynamic = 'force-dynamic';

export default function TemplatesPage() {
  return (
    <AppLayout>
      <TemplatesStudio />
    </AppLayout>
  );
}
