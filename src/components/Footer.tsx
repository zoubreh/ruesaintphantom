import { getSiteSettings } from '@/lib/data';

export async function Footer() {
  const settings = await getSiteSettings();

  const contactEmail = settings?.contactEmail ?? 'hello@ard.ac';
  const socialLinks = settings?.socialLinks ?? [];
  const footerNote = settings?.footerNote ?? `© ${new Date().getFullYear()} RUESAINTPHANTOM`;

  return (
    <footer className="border-t border-[#e5e5e5] px-4 sm:px-6 lg:px-10 py-10 md:py-16 bg-white">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 text-[13px] text-[#1a1a1a]">
        <div className="flex flex-col gap-2">
          <a
            href={`mailto:${contactEmail}`}
            className="uppercase tracking-[0.027em] hover:text-[#525252] transition-colors duration-200"
          >
            {contactEmail}
          </a>
          {socialLinks?.map((link, i) =>
            link.url ? (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="uppercase tracking-[0.027em] hover:text-[#525252] transition-colors duration-200"
              >
                {link.label ?? link.url}
              </a>
            ) : null
          )}
          {/* Default Instagram link if no social links from CMS */}
          {(!socialLinks || socialLinks.length === 0) && (
            <a
              href="https://instagram.com/ruesaintphantom"
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase tracking-[0.027em] hover:text-[#525252] transition-colors duration-200"
            >
              Instagram
            </a>
          )}
        </div>
        <p className="text-[11px] uppercase tracking-[0.04em] text-[#737373]">{footerNote}</p>
      </div>
    </footer>
  );
}
