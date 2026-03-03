import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

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
      <body className={`${inter.variable} font-sans bg-surface text-foreground min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
