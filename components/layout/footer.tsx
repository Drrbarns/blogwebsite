import Link from "next/link";
import { Logo } from "@/components/shared/logo";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: FacebookIcon,
  twitter: XIcon,
  x: XIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
};

const SOCIAL_LABELS: Record<string, string> = {
  facebook: "Facebook",
  twitter: "X (Twitter)",
  x: "X (Twitter)",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

export type FooterColumn = { title: string; links: { label: string; url: string }[] };

export type FooterContact = {
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type FooterSocials = Partial<Record<keyof typeof SOCIAL_ICONS, string | null>>;

export interface FooterProps {
  brandName?: string;
  brandHref?: string;
  brandLogoUrl?: string | null;
  tagline?: string;
  description?: string;
  columns?: FooterColumn[];
  contact?: FooterContact;
  socials?: FooterSocials;
  copyright?: string;
}

export function Footer({
  brandName,
  brandHref = "/",
  brandLogoUrl,
  tagline,
  description,
  columns,
  contact,
  socials,
  copyright,
}: FooterProps = {}) {
  const cols = columns && columns.length > 0 ? columns : null;
  const socialEntries = (
    Object.entries(socials ?? {}) as [keyof typeof SOCIAL_ICONS, string | null | undefined][]
  )
    .filter(([key, href]) => Boolean(href) && SOCIAL_ICONS[key])
    .map(([key, href]) => ({
      key,
      Icon: SOCIAL_ICONS[key],
      href: href as string,
      label: SOCIAL_LABELS[key] ?? key,
    }));

  const contactBlock =
    contact &&
    (contact.email || contact.phone || contact.address) ? (
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
          How to Find Us
        </h3>
        <div className="space-y-4 text-[15px] text-muted">
          {contact.address && <p className="leading-relaxed whitespace-pre-line">{contact.address}</p>}
          {contact.email && (
            <p>
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-foreground transition-colors"
              >
                {contact.email}
              </a>
            </p>
          )}
          {contact.phone && (
            <p>
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="hover:text-foreground transition-colors"
              >
                {contact.phone}
              </a>
            </p>
          )}
        </div>
      </div>
    ) : null;

  return (
    <footer className="w-full border-t border-stone-200 bg-background">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1fr] gap-10 lg:gap-16">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Logo name={brandName} href={brandHref} imageUrl={brandLogoUrl} />
            {(tagline || description) && (
              <p className="mt-5 text-sm text-muted leading-relaxed max-w-xs">
                {tagline || description}
              </p>
            )}
            {socialEntries.length > 0 && (
              <div className="flex items-center gap-3 mt-6">
                {socialEntries.map(({ key, Icon, href, label }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full text-foreground/50 hover:text-foreground hover:bg-stone-100 transition-colors"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {cols ? (
            cols.slice(0, 2).map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
                  {col.title}
                </h3>
                <ul className="space-y-3 text-[15px] text-muted">
                  {(col.links ?? []).map((l) => (
                    <li key={`${l.label}-${l.url}`}>
                      <Link
                        href={l.url}
                        className="hover:text-foreground transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
                  Explore
                </h3>
                <ul className="space-y-3 text-[15px] text-muted">
                  <li><Link href="/blog" className="hover:text-foreground transition-colors">All articles</Link></li>
                  <li><Link href="/authors" className="hover:text-foreground transition-colors">Authors</Link></li>
                  <li><Link href="/search" className="hover:text-foreground transition-colors">Search</Link></li>
                  <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground mb-5">
                  Company
                </h3>
                <ul className="space-y-3 text-[15px] text-muted">
                  <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                  <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                  <li><Link href="/newsletter" className="hover:text-foreground transition-colors">Newsletter</Link></li>
                  <li><Link href="/rss.xml" className="hover:text-foreground transition-colors">RSS feed</Link></li>
                </ul>
              </div>
            </>
          )}

          {contactBlock}
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <p className="text-sm text-muted">
            {copyright ??
              `© ${new Date().getFullYear()} — ${brandName ?? "About a Girl"}. All Rights Reserved.`}
          </p>
          <p className="text-sm text-muted">
            Powered by{" "}
            <a
              href="https://doctorbarns.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground/80 hover:text-foreground transition-colors"
            >
              Doctor Barns Tech
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
