import AppLayout from '@/components/AppLayout';
import WorkspaceHome from '@/components/studio/WorkspaceHome';

export const dynamic = 'force-dynamic';

export default function WorkspacePage() {
  return (
    <AppLayout>
      <WorkspaceHome />
    </AppLayout>
  );
}
