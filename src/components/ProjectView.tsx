'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProjectTitle } from '@/context/ProjectTitleContext';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { MediaViewer } from './MediaViewer';
import {
  MODAL_OPEN_DURATION,
  MODAL_CLOSE_DURATION,
  EASE_OUT_EXPO,
} from '@/lib/constants';
import type { IndexProject } from '@/types/project';

export interface ProjectNavLink {
  slug: string;
  title: string;
}

export function ProjectView({
  project,
  isModal,
  prevProject,
  nextProject,
}: {
  project: IndexProject;
  isModal: boolean;
  prevProject?: ProjectNavLink | null;
  nextProject?: ProjectNavLink | null;
}) {
  const router = useRouter();
  const { setProjectTitle } = useProjectTitle();
  const [isClosing, setIsClosing] = useState(false);

  useBodyScrollLock(isModal);
  const focusTrapRef = useFocusTrap(isModal && !isClosing);

  useEffect(() => {
    setProjectTitle(project.title);
    return () => setProjectTitle(null);
  }, [project.title, setProjectTitle]);

  const close = useCallback(() => {
    if (!isModal) {
      router.push('/');
      return;
    }
    setIsClosing(true);
  }, [isModal, router]);

  const onCloseAnimationComplete = useCallback(() => {
    if (isClosing) router.back();
  }, [isClosing, router]);

  useEffect(() => {
    if (!isModal) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isModal, close]);

  const duration = isClosing ? MODAL_CLOSE_DURATION : MODAL_OPEN_DURATION;

  const content = (
    <>
      <div className="sticky top-0 z-10 flex items-center justify-end px-4 py-3 md:px-6">
        <button
          type="button"
          onClick={close}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground-secondary hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded"
          aria-label="Close project"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 4L14 14M14 4L4 14" />
          </svg>
        </button>
      </div>
      <div className="px-4 pb-12 md:px-6">
        <MediaViewer project={project} onClose={close} />

        {/* Credits */}
        {project.credits && project.credits.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border text-sm text-foreground-secondary">
            <dl className="space-y-1">
              {project.credits.map((c, i) => (
                <div key={i} className="flex flex-wrap gap-x-2 gap-y-0">
                  <dt className="uppercase tracking-wider text-muted">{c.label}</dt>
                  <dd>
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-foreground underline focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded">
                        {c.value || c.url}
                      </a>
                    ) : (
                      <span>{c.value}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Next / Prev project navigation */}
        {(prevProject || nextProject) && (
          <nav className="mt-12 pt-8 border-t border-border flex items-center justify-between" aria-label="Project navigation">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors"
                scroll={false}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5">
                  <path d="M10 3L5 8L10 13" />
                </svg>
                <span className="uppercase tracking-wider text-xs">{prevProject.title}</span>
              </Link>
            ) : <span />}
            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex items-center gap-2 text-sm text-foreground-secondary hover:text-foreground transition-colors"
                scroll={false}
              >
                <span className="uppercase tracking-wider text-xs">{nextProject.title}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M6 3L11 8L6 13" />
                </svg>
              </Link>
            ) : <span />}
          </nav>
        )}
      </div>
    </>
  );

  if (isModal) {
    return (
      <div
        ref={focusTrapRef}
        className="fixed inset-0 z-40"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >
        <motion.div
          className="absolute inset-0 bg-surface"
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ duration, ease: EASE_OUT_EXPO }}
          onClick={close}
          aria-hidden="true"
        />
        <motion.div
          className="absolute inset-0 overflow-y-auto modal-scroll-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: isClosing ? 0 : 1,
            y: isClosing ? 20 : 0,
          }}
          transition={{ duration, ease: EASE_OUT_EXPO }}
          onAnimationComplete={onCloseAnimationComplete}
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {content}
    </div>
  );
}
