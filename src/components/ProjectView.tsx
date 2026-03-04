'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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

export function ProjectView({
  project,
  isModal,
}: {
  project: IndexProject;
  isModal: boolean;
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
      <div className="sticky top-0 z-10 flex items-center justify-end px-4 py-3 md:px-6 bg-white border-b border-[#e5e5e5]">
        <button
          type="button"
          onClick={close}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#525252] hover:text-[#1a1a1a] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]"
          aria-label="Close project"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M4 4L14 14M14 4L4 14" />
          </svg>
        </button>
      </div>
      <div className="px-4 pb-16 md:px-10 bg-white">
        <MediaViewer project={project} onClose={close} />
        {project.credits && project.credits.length > 0 && (
          <div className="mt-12 pt-8 border-t border-[#e5e5e5] text-[13px] text-[#525252]">
            <dl className="space-y-1.5">
              {project.credits.map((c, i) => (
                <div key={i} className="flex flex-wrap gap-x-3 gap-y-0">
                  <dt className="uppercase tracking-[0.04em] text-[#737373] text-[11px]">{c.label}</dt>
                  <dd className="text-[13px] text-[#1a1a1a]">
                    {c.url ? (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#525252] underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]">
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
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          transition={{ duration, ease: EASE_OUT_EXPO }}
          onClick={close}
          aria-hidden="true"
        />
        {/* Content — slides up */}
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
    <div className="min-h-screen bg-white">
      {content}
    </div>
  );
}
