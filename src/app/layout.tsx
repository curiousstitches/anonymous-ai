import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodePilot - Your AI Development Assistant',
  description:
    'CodePilot is an intelligent AI assistant that helps you code faster and smarter.',
  keywords: ['AI', 'coding', 'development', 'assistant'],
  authors: [{ name: 'CodePilot Team' }],
  viewport: 'width=device-width, initial-scale=1.0',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://codepilot.dev',
    siteName: 'CodePilot',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors`}>
        {children}
      </body>
    </html>
  );
}
