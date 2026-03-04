import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'RUESAINTPHANTOM', template: '%s — RUESAINTPHANTOM' },
  description: 'Image-first minimal portfolio',
  openGraph: { type: 'website' },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="antialiased">
      <body className="font-sans bg-surface text-[#1a1a1a] min-h-screen">
        {children}
      </body>
    </html>
  );
}
