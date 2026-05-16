import Link from 'next/link';
import { Sparkles } from 'lucide-react';

type PublicSiteShellProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/templates', label: 'Templates' },
  { href: '/tutorial', label: 'Tutorial' },
  { href: '/pricing', label: 'API Plans' },
];

export default function PublicSiteShell({ eyebrow, title, description, children }: PublicSiteShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[var(--accent)] shadow-[0_0_30px_var(--surface-glow)]">
              <Sparkles size={18} />
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/60">CodePilot</p>
              <p className="text-base text-white">AI Build Studio</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="transition hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/sign-up-login-screen" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/20 hover:text-white">
              Sign in
            </Link>
            <Link href="/workspace" className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_var(--surface-glow)] transition hover:brightness-110">
              Open workspace
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="max-w-3xl space-y-5 pb-10">
          {eyebrow ? (
            <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="max-w-2xl text-base leading-7 text-white/70 sm:text-lg">{description}</p>
        </div>
        {children}
      </main>
    </div>
  );
}
