import AppLayout from '@/components/AppLayout';
import TutorialsStudio from '@/components/studio/TutorialsStudio';

export const dynamic = 'force-dynamic';

export default function TutorialsPage() {
  return (
    <AppLayout>
      <TutorialsStudio />
    </AppLayout>
  );
}
