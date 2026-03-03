import { HeaderNav } from '@/components/HeaderNav';
import { Footer } from '@/components/Footer';
import { PageTransition } from '@/components/PageTransition';
import { ProjectTitleProvider } from '@/context/ProjectTitleContext';
import { ScrollRestoration } from '@/components/ScrollRestoration';

export default function SiteLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <ProjectTitleProvider>
      <ScrollRestoration />
      <HeaderNav />
      <main className="min-h-screen w-full">
        <PageTransition>{children}</PageTransition>
        {modal}
      </main>
      <Footer />
    </ProjectTitleProvider>
  );
}
