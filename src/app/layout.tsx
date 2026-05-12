import React from 'react';
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import '../styles/tailwind.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'CodePilot — AI Coding Assistant, No Limits',
  description:
    'CodePilot is a self-hosted AI coding assistant supporting Ollama, OpenAI, Anthropic, and Gemini — open to any registered developer with no usage caps.',
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&family=Exo+2:wght@400;600;700&family=Audiowide&family=Russo+One&family=Bebas+Neue&family=Righteous&family=Bungee&family=Press+Start+2P&family=VT323&family=Share+Tech+Mono&family=Courier+Prime:wght@400;700&family=Cinzel:wght@400;700;900&family=Playfair+Display:wght@400;700&family=Cormorant+Garamond:wght@400;600;700&family=Dancing+Script:wght@400;700&family=Pacifico&family=Permanent+Marker&family=Bangers&family=Fredoka+One&family=Lobster&family=Abril+Fatface&family=Black+Han+Sans&family=Noto+Sans+JP:wght@400;700&family=Saira+Condensed:wght@400;700&family=Chakra+Petch:wght@400;700&family=Michroma&family=Quantico:wght@400;700&family=Teko:wght@400;600&family=Barlow+Condensed:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fcodepilot6657back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.18" />
        <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.2" /></head>
      <body className={GeistSans.className}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: 'var(--card)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              fontFamily: 'var(--font-sans)',
            },
          }}
        />
</body>
    </html>
  );
}