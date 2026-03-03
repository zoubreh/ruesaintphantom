'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProjectTitle } from '@/context/ProjectTitleContext';

export function HeaderNav() {
  const { projectTitle } = useProjectTitle();
  const pathname = usePathname();
  const isIndex = pathname === '/';
  const isInfo = pathname === '/info';

  return (
    <header className="sticky top-0 z-50 flex items-center gap-4 px-4 py-3 md:px-6 bg-surface/80 backdrop-blur-sm border-b border-border min-h-[44px]">
      <nav className="flex items-center gap-4 text-sm uppercase tracking-wide text-foreground-secondary" aria-label="Main">
        <Link
          href="/"
          className={`min-h-[44px] min-w-[44px] flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded ${isIndex ? 'text-foreground font-medium' : 'hover:text-foreground'}`}
          aria-current={isIndex ? 'page' : undefined}
        >
          {isIndex ? <span className="text-foreground" aria-hidden>●</span> : null}
          Index
        </Link>
        <Link
          href="/info"
          className={`min-h-[44px] min-w-[44px] flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded ${isInfo ? 'text-foreground font-medium' : 'hover:text-foreground'}`}
          aria-current={isInfo ? 'page' : undefined}
        >
          {isInfo ? <span className="text-foreground" aria-hidden>●</span> : null}
          Info
        </Link>
      </nav>
      {projectTitle && (
        <span className="text-sm uppercase tracking-wide text-foreground-secondary truncate max-w-[50vw] md:max-w-none">
          {projectTitle}
        </span>
      )}
    </header>
  );
}
