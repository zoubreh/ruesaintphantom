import { getSiteSettings } from '@/lib/data';

export async function Footer() {
  const settings = await getSiteSettings();

  if (!settings) return null;

  const { contactEmail, socialLinks, footerNote } = settings;
  const hasContent = contactEmail || (socialLinks && socialLinks.length > 0) || footerNote;

  if (!hasContent) return null;

  return (
    <footer className="border-t border-border/30 px-3 sm:px-4 md:px-6 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-neutral-500 uppercase tracking-wider">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="hover:text-neutral-200 transition-colors"
            >
              {contactEmail}
            </a>
          )}
          {socialLinks?.map((link, i) => (
            link.url ? (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-neutral-200 transition-colors"
              >
                {link.label ?? link.url}
              </a>
            ) : null
          ))}
        </div>
        {footerNote && (
          <p className="text-neutral-600">{footerNote}</p>
        )}
      </div>
    </footer>
  );
}
