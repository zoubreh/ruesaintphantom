'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectTitle } from '@/context/ProjectTitleContext';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import { MediaViewer } from './MediaViewer';
import type { IndexProject } from '@/types/project';

const CLOSE_DURATION = 0.2;

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
  useBodyScrollLock(isModal && !isClosing);

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

  const content = (
    <>
      <div className="sticky top-[52px] z-10 flex items-center justify-end px-4 py-2 md:px-6">
        <button
          type="button"
          onClick={close}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
          aria-label="Close project"
        >
          <span className="text-2xl leading-none" aria-hidden>×</span>
        </button>
      </div>
      <div className="px-4 pb-12 md:px-6">
        <MediaViewer project={project} onClose={close} />
      </div>
    </>
  );

  if (isModal) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-40 bg-surface overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: CLOSE_DURATION }}
          onAnimationComplete={onCloseAnimationComplete}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen">
      {content}
    </div>
  );
}
