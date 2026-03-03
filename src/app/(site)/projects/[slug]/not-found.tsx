import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <p className="text-muted text-sm uppercase tracking-wide">Project not found</p>
      <Link
        href="/"
        className="mt-4 text-foreground-secondary underline hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded"
      >
        Back to Index
      </Link>
    </div>
  );
}
