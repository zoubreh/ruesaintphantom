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
    <header className="sticky top-0 z-50 flex items-center gap-4 px-4 md:px-6 h-[60px] bg-white border-b border-[#e5e5e5]">
      <nav className="flex items-center gap-4 text-[13px] uppercase tracking-[0.027em] text-[#525252]" aria-label="Main">
        <Link
          href="/"
          className={`min-h-[44px] min-w-[44px] flex items-center gap-1.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] ${isIndex ? 'text-[#1a1a1a] font-medium' : 'hover:text-[#1a1a1a]'}`}
          aria-current={isIndex ? 'page' : undefined}
        >
          {isIndex ? <span aria-hidden>●</span> : null}
          Index
        </Link>
        <Link
          href="/info"
          className={`min-h-[44px] min-w-[44px] flex items-center gap-1.5 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] ${isInfo ? 'text-[#1a1a1a] font-medium' : 'hover:text-[#1a1a1a]'}`}
          aria-current={isInfo ? 'page' : undefined}
        >
          {isInfo ? <span aria-hidden>●</span> : null}
          Info
        </Link>
      </nav>
      {projectTitle && (
        <span className="text-[13px] uppercase tracking-[0.027em] text-[#525252] truncate max-w-[50vw] md:max-w-none">
          {projectTitle}
        </span>
      )}
    </header>
  );
}
