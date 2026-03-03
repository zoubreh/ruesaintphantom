'use client';

import { useRef, useEffect, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import type { IndexProject } from '@/types/project';

export function ResponsiveGrid({ projects }: { projects: IndexProject[] }) {
  const withCover = projects.filter((p) => p.coverImage);
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const batch = 12;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setVisibleCount((n) => Math.min(n + batch, withCover.length));
      },
      { rootMargin: '200px', threshold: 0 }
    );
    const sentinel = el.querySelector('[data-sentinel]');
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [withCover.length]);

  const visible = withCover.slice(0, visibleCount);

  if (withCover.length === 0) {
    return (
      <div className="py-24 text-center text-neutral-500">
        <p className="text-sm uppercase tracking-wide">No projects yet</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="px-3 py-6 md:px-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
        {visible.map((project, i) => (
          <ProjectCard key={project._id} project={project} priority={i < 2} />
        ))}
      </div>
      <div data-sentinel className="h-1 w-full" aria-hidden />
    </div>
  );
}
