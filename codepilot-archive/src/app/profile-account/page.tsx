import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProfileAccount from './components/ProfileAccount';

// Disable static pre-rendering — this page uses client-side context (ThemeProvider, AuthContext)
export const dynamic = 'force-dynamic';

export default function ProfileAccountPage() {
  return (
    <AppLayout>
      <ProfileAccount />
    </AppLayout>
  );
}
