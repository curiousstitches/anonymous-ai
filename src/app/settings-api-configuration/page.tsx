import React from 'react';
import AppLayout from '@/components/AppLayout';
import SettingsScreen from './components/SettingsScreen';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <AppLayout>
      <SettingsScreen />
    </AppLayout>
  );
}