import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProjectContextManager from './components/ProjectContextManager';

export const dynamic = 'force-dynamic';

export default function ProjectContextManagerPage() {
  return (
    <AppLayout>
      <ProjectContextManager />
    </AppLayout>
  );
}