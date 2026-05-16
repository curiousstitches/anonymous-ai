import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import AppProviders from '@/components/AppProviders';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodePilot - AI Build Studio',
  description:
    'Build complete, runnable code instantly. Describe your app, upload an image, or sync a repo. Powered by the best free and premium AI engines.',
  keywords: ['AI', 'code builder', 'code generator', 'Puter AI', 'GitHub', 'development', 'scaffold'],
  authors: [{ name: 'CodePilot Team' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://happyappzai.com',
    siteName: 'CodePilot',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-[var(--background)] text-[var(--foreground)] transition-colors`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
