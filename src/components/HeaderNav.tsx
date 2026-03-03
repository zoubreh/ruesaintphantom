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
    <header className="sticky top-0 z-50 flex items-center gap-4 px-4 py-3 md:px-6 bg-surface/80 backdrop-blur-sm border-b border-border/50 min-h-[44px]">
      <nav className="flex items-center gap-4 text-sm uppercase tracking-wide text-neutral-300" aria-label="Main">
        <Link
          href="/"
          className={`min-h-[44px] min-w-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded ${isIndex ? 'text-white' : 'hover:text-white'}`}
          aria-current={isIndex ? 'page' : undefined}
        >
          <span className={isIndex ? 'text-white' : ''}>●</span> Index
        </Link>
        <Link
          href="/info"
          className={`min-h-[44px] min-w-[44px] flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded ${isInfo ? 'text-white' : 'hover:text-white'}`}
          aria-current={isInfo ? 'page' : undefined}
        >
          Info
        </Link>
      </nav>
      {projectTitle && (
        <span className="text-sm uppercase tracking-wide text-neutral-400 truncate max-w-[50vw] md:max-w-none">
          {projectTitle}
        </span>
      )}
    </header>
  );
}
