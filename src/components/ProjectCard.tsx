'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { urlFor } from '@/lib/image';
import type { IndexProject } from '@/types/project';

export function ProjectCard({ project, priority = false }: { project: IndexProject; priority?: boolean }) {
  const [hover, setHover] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const coverUrl = urlFor(project.coverImage);
  const src = coverUrl?.width(800).height(800).fit('max').url() ?? '';
  const blurUrl = coverUrl?.width(40).height(40).blur(10).url() ?? '';

  const meta = [project.year, project.client, project.tags?.slice(0, 2)].filter(Boolean).flat();

  return (
    <Link
      ref={linkRef}
      href={`/projects/${project.slug}`}
      className="block relative aspect-[3/4] overflow-hidden rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      scroll={false}
    >
      <Image
        src={src}
        alt={project.title}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-300 ease-out"
        style={{ objectFit: 'cover' }}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurUrl}
      />
      <motion.div
        className="absolute inset-0 bg-surface/80 flex flex-col justify-end p-3 md:p-4"
        initial={false}
        animate={{ opacity: hover ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-xs md:text-sm font-medium text-neutral-200 uppercase tracking-wide truncate">
          {project.title}
        </p>
        {meta.length > 0 && (
          <p className="text-xs text-neutral-500 mt-0.5 truncate">
            {meta.join(' · ')}
          </p>
        )}
      </motion.div>
    </Link>
  );
}
