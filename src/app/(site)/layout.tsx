import { HeaderNav } from '@/components/HeaderNav';
import { Footer } from '@/components/Footer';
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
        {children}
        {modal}
      </main>
      <Footer />
    </ProjectTitleProvider>
  );
}
