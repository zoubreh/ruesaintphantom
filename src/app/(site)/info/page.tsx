import { getInfoPage } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'Info',
    description: 'Contact and information.',
  };
}

function InfoSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-2">
        {heading}
      </h2>
      {children}
    </section>
  );
}

export default async function InfoPage() {
  const info = await getInfoPage();

  const hasContent =
    info &&
    (info.representedBy ||
      info.address ||
      info.contactEmail ||
      (info.sections && info.sections.length > 0) ||
      info.imprintText ||
      info.copyright ||
      info.programmingBy);

  if (!info || !hasContent) {
    const year = new Date().getFullYear();
    return (
      <div className="max-w-prose mx-auto px-4 py-12 md:py-16">
        <div className="space-y-10 text-sm text-foreground-secondary">
          <InfoSection heading="Studio">
            <p className="text-foreground">RUESAINTPHANTOM</p>
          </InfoSection>

          <InfoSection heading="Contact">
            <a
              href="mailto:contact@ruesaintphantom.com"
              className="text-foreground underline hover:text-foreground-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded"
            >
              contact@ruesaintphantom.com
            </a>
          </InfoSection>

          <InfoSection heading="Social">
            <a
              href="https://instagram.com/ruesaintphantom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline hover:text-foreground-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded"
            >
              Instagram
            </a>
          </InfoSection>

          <p className="text-muted text-xs pt-8">
            &copy; {year} RUESAINTPHANTOM. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-prose mx-auto px-4 py-12 md:py-16">
      <div className="space-y-10 text-sm text-foreground-secondary">
        {info.representedBy && (
          <InfoSection heading="Represented by">
            <p className="text-foreground">{info.representedBy}</p>
          </InfoSection>
        )}

        {info.address && (
          <InfoSection heading="Address">
            <p className="whitespace-pre-line text-foreground">{info.address}</p>
          </InfoSection>
        )}

        {info.contactEmail && (
          <InfoSection heading="Contact">
            <a
              href={`mailto:${info.contactEmail}`}
              className="text-foreground underline hover:text-foreground-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded"
            >
              {info.contactEmail}
            </a>
          </InfoSection>
        )}

        {info.programmingBy && (
          <InfoSection heading="Programming by">
            <p className="text-foreground">{info.programmingBy}</p>
          </InfoSection>
        )}

        {info.sections?.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted mb-2">
                {section.heading}
              </h2>
            )}
            {section.body && <p className="text-foreground whitespace-pre-line">{section.body}</p>}
            {section.links?.map((link, j) => (
              <a
                key={j}
                href={link.href ?? '#'}
                className="block text-foreground underline hover:text-foreground-secondary mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded"
              >
                {link.label ?? link.href}
              </a>
            ))}
          </section>
        ))}

        {info.imprintText && (
          <InfoSection heading="Imprint">
            <p className="text-foreground whitespace-pre-line">{info.imprintText}</p>
          </InfoSection>
        )}

        {info.copyright && (
          <p className="text-muted text-xs pt-8">{info.copyright}</p>
        )}
      </div>
    </div>
  );
}
