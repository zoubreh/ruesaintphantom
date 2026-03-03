import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <p className="text-neutral-500 text-sm uppercase tracking-wide">Not found</p>
      <Link
        href="/"
        className="mt-4 text-neutral-300 underline hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
      >
        Back to Index
      </Link>
    </div>
  );
}
