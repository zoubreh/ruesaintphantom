'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <p className="text-muted text-sm uppercase tracking-wide">Something went wrong</p>
      <button
        onClick={reset}
        className="mt-4 text-foreground-secondary underline hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded"
      >
        Try again
      </button>
    </div>
  );
}
