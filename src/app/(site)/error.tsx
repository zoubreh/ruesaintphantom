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
      <p className="text-[#737373] text-[13px] uppercase tracking-[0.04em]">Something went wrong</p>
      <button
        onClick={reset}
        className="mt-4 text-[#525252] underline hover:text-[#1a1a1a] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]"
      >
        Try again
      </button>
    </div>
  );
}
