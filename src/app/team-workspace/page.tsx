import AppLayout from '@/components/AppLayout';
import TeamWorkspaceStudio from '@/components/studio/TeamWorkspaceStudio';

export const dynamic = 'force-dynamic';

export default function TeamWorkspacePage() {
  return (
    <AppLayout>
      <TeamWorkspaceStudio />
    </AppLayout>
  );
}
