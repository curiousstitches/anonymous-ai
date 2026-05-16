import AppLayout from '@/components/AppLayout';
import GitHubStudio from '@/components/studio/GitHubStudio';

export const dynamic = 'force-dynamic';

export default function GitHubPage() {
  return (
    <AppLayout>
      <GitHubStudio />
    </AppLayout>
  );
}
