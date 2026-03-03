import { getInfoPage } from '@/lib/data';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'Info',
    description: 'Contact and information.',
  };
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
    return (
      <div className="max-w-prose mx-auto px-4 py-16 text-neutral-500 text-sm">
        <p>
          {!info
            ? 'No info content yet.'
            : 'Add your content in Sanity Studio at /studio.'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-prose mx-auto px-4 py-12 md:py-16">
      <div className="space-y-10 text-sm text-neutral-300">
        {info.representedBy && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
              Represented by
            </h2>
            <p className="text-neutral-200">{info.representedBy}</p>
          </section>
        )}

        {info.address && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
              Address
            </h2>
            <p className="whitespace-pre-line text-neutral-200">{info.address}</p>
          </section>
        )}

        {info.contactEmail && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
              Contact
            </h2>
            <a
              href={`mailto:${info.contactEmail}`}
              className="text-neutral-200 underline hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
            >
              {info.contactEmail}
            </a>
          </section>
        )}

        {info.programmingBy && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
              Programming by
            </h2>
            <p className="text-neutral-200">{info.programmingBy}</p>
          </section>
        )}

        {info.sections?.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
                {section.heading}
              </h2>
            )}
            {section.body && <p className="text-neutral-200 whitespace-pre-line">{section.body}</p>}
            {section.links?.map((link, j) => (
              <a
                key={j}
                href={link.href ?? '#'}
                className="block text-neutral-200 underline hover:text-white mt-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
              >
                {link.label ?? link.href}
              </a>
            ))}
          </section>
        ))}

        {info.imprintText && (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-wider text-neutral-500 mb-2">
              Imprint
            </h2>
            <p className="text-neutral-200 whitespace-pre-line">{info.imprintText}</p>
          </section>
        )}

        {info.copyright && (
          <p className="text-neutral-500 text-xs pt-8">{info.copyright}</p>
        )}
      </div>
    </div>
  );
}
