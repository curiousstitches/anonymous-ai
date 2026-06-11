'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import AnimatedBackground from './AnimatedBackground';
import { Menu } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const PAGE_TITLES: Record<string, string> = {
  '/': 'Chat',
  '/usage-dashboard': 'Usage Dashboard',
  '/project-context-manager': 'Projects',
  '/theme-dashboard': 'Theme Studio',
  '/settings-api-configuration': 'Settings',
  '/profile-account': 'Profile',
  '/admin/api-usage': 'API Monitor',
  '/admin/event-log': 'Event Log',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  for (const [key, val] of Object.entries(PAGE_TITLES)) {
    if (key !== '/' && pathname.startsWith(key)) return val;
  }
  return 'CodePilot';
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Animated background */}
      <AnimatedBackground />

      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
        {/* Mobile topbar */}
        <div
          className="flex items-center gap-3 px-4 py-3 lg:hidden border-b flex-shrink-0"
          style={{ borderColor: 'var(--border)', background: 'var(--card)' }}
        >
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-lg transition-all active:scale-95 flex-shrink-0"
            style={{ color: 'var(--foreground)', background: 'var(--muted)' }}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <span className="font-semibold text-sm gradient-text truncate">{pageTitle}</span>
        </div>

        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}