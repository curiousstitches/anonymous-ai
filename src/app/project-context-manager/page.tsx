import AppLayout from '@/components/AppLayout';
import TemplatesStudio from '@/components/studio/TemplatesStudio';

export const dynamic = 'force-dynamic';

export default function ProjectContextManagerPage() {
  return (
    <AppLayout>
      <TemplatesStudio />
    </AppLayout>
  );
}
