'use client';

import { ProjectCell } from './ProjectCell';
import type { ProjectGridItem } from '@/types/grid';

export function ProjectGrid({ items }: { items: ProjectGridItem[] }) {
  if (items.length === 0) {
    return (
      <div className="py-24 text-center text-foreground-secondary">
        <p className="text-sm uppercase tracking-wide">No projects yet</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-w-0 overflow-hidden px-3 sm:px-4 md:px-6 lg:px-8 pt-4 md:pt-6 pb-12">
      <div className="project-grid">
        {items.map((item, i) => (
          <ProjectCell key={item._id} item={item} priority={i < 4} index={i} />
        ))}
      </div>
    </div>
  );
}
