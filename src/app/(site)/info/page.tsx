import { getInfoPage } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'Info',
    description: 'Studio, services, and contact.',
  };
}

function InfoSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#737373] mb-3">
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

  const year = new Date().getFullYear();

  if (!info || !hasContent) {
    return (
      <div className="max-w-prose mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="space-y-10 text-[13px] text-[#1a1a1a]">

          <InfoSection heading="Studio">
            <p className="leading-[1.7]">
              RUESAINTPHANTOM is an independent creative studio specialising in
              CGI, 3D, and art direction for luxury and fashion brands. Based between
              Paris and Montréal, we craft image-forward narratives that bridge craft
              and technology.
            </p>
          </InfoSection>

          <InfoSection heading="Services">
            <ul className="space-y-1.5 text-[#1a1a1a]">
              {['Creative Direction', '3D & CGI', 'Art Direction', 'Photography', 'Brand Identity'].map((s) => (
                <li key={s} className="uppercase tracking-[0.04em] text-[13px]">{s}</li>
              ))}
            </ul>
          </InfoSection>

          <InfoSection heading="Selected Clients">
            <ul className="space-y-1.5 text-[#525252]">
              {['Audemars Piguet', 'Hublot', 'Chanel', 'Givenchy', 'Cartier', 'Louis Vuitton'].map((c) => (
                <li key={c} className="uppercase tracking-[0.04em] text-[13px]">{c}</li>
              ))}
            </ul>
          </InfoSection>

          <InfoSection heading="Contact">
            <a
              href="mailto:hello@ard.ac"
              className="text-[#1a1a1a] underline hover:text-[#525252] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]"
            >
              hello@ard.ac
            </a>
          </InfoSection>

          <InfoSection heading="Social">
            <a
              href="https://instagram.com/ruesaintphantom"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1a1a1a] underline hover:text-[#525252] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]"
            >
              Instagram
            </a>
          </InfoSection>

          <p className="text-[11px] uppercase tracking-[0.04em] text-[#737373] pt-8 border-t border-[#e5e5e5]">
            &copy; {year} RUESAINTPHANTOM. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-prose mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="space-y-10 text-[13px] text-[#1a1a1a]">
        {info.representedBy && (
          <InfoSection heading="Represented by">
            <p>{info.representedBy}</p>
          </InfoSection>
        )}

        {info.address && (
          <InfoSection heading="Address">
            <p className="whitespace-pre-line text-[#525252]">{info.address}</p>
          </InfoSection>
        )}

        {info.contactEmail && (
          <InfoSection heading="Contact">
            <a
              href={`mailto:${info.contactEmail}`}
              className="text-[#1a1a1a] underline hover:text-[#525252] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]"
            >
              {info.contactEmail}
            </a>
          </InfoSection>
        )}

        {info.programmingBy && (
          <InfoSection heading="Programming by">
            <p className="text-[#525252]">{info.programmingBy}</p>
          </InfoSection>
        )}

        {info.sections?.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#737373] mb-3">
                {section.heading}
              </h2>
            )}
            {section.body && <p className="whitespace-pre-line text-[#525252] leading-[1.7]">{section.body}</p>}
            {section.links?.map((link, j) => (
              <a
                key={j}
                href={link.href ?? '#'}
                className="block text-[#1a1a1a] underline hover:text-[#525252] transition-colors duration-200 mt-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]"
              >
                {link.label ?? link.href}
              </a>
            ))}
          </section>
        ))}

        {info.imprintText && (
          <InfoSection heading="Imprint">
            <p className="whitespace-pre-line text-[#525252] leading-[1.7]">{info.imprintText}</p>
          </InfoSection>
        )}

        {info.copyright && (
          <p className="text-[11px] uppercase tracking-[0.04em] text-[#737373] pt-8 border-t border-[#e5e5e5]">
            {info.copyright}
          </p>
        )}
      </div>
    </div>
  );
}
