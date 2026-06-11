import styles from './Footer.module.css';
import WaitlistForm from './WaitlistForm';

// Figma node 3:1782 / 3:2978 — "Main Frame": waitlist CTA modal + footer links grid.
// Modal heading/description, background colour and form fields vary per page → props.
// The footer links grid + logo + copyright are identical across pages.

export interface FormField {
  label: string;
  placeholder: string;
  /** select inputs show a chevron and have no required asterisk styling difference */
  type?: 'text' | 'select';
  id?: string;
  /** Options for a select field, rendered after the placeholder option. */
  options?: string[];
}

interface FooterProps {
  /** CTA modal heading (style_ESHG40). */
  ctaHeading: string;
  /** CTA modal description (style_Y9AAFZ). */
  ctaDescription: string;
  /** Per-page form fields (Accounting differs from Marketplace). */
  fields: FormField[];
  /** Modal background colour (Figma fill, page-specific). Defaults to Accounting #B9B9B9. */
  modalBg?: string;
  /** Submit button label (Figma varies per page). Defaults to "Join waitlist". */
  submitLabel?: string;
  className?: string;
}

const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  { heading: 'Product', links: [{ label: 'Marketplace', href: '#' }, { label: 'TMS for Carriers', href: '#' }, { label: 'TMS for Brokers', href: '#' }, { label: 'Live Tracking', href: '#' }, { label: 'Accounting', href: '#' }, { label: '$LHunt', href: '#' }] },
  { heading: 'Solutions', links: [{ label: 'For Carriers', href: '#' }, { label: 'For Brokers', href: '#' }, { label: 'For Partners', href: '#' }] },
  { heading: 'Company', links: [{ label: 'About us', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Articles', href: '#' }] },
  { heading: 'Terms & Policies', links: [{ label: 'Terms of service', href: '#' }, { label: 'Privacy policy', href: '#' }] },
];

export default function Footer({
  ctaHeading,
  ctaDescription,
  fields,
  modalBg = 'var(--c-modal-bg-default)',
  submitLabel,
  className,
}: FooterProps) {
  return (
    <div className={`${styles.footer} ${className ?? ''}`}>
      {/* CTA modal — layout_NAC9O0: row, center, gap 200, padding x20, w1880 */}
      <div className={styles.modal} data-reveal>
        <div className={styles.modalBg} style={{ background: modalBg }}>
          <div className={styles.modalGradient} />
          <div className={styles.modalContent}>
            <div className={styles.modalLogo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/shared/logo-footer.svg" alt="" width={24} height={23} />
              <span className={styles.modalLogoText}>huntOS</span>
            </div>
            <h2 className={styles.modalHeading}>{ctaHeading}</h2>
            <p className={styles.modalDesc}>{ctaDescription}</p>
          </div>
        </div>

        <WaitlistForm fields={fields} submitLabel={submitLabel} />
      </div>

      {/* Footer links — layout_X8KU64 #FAFAFA container */}
      <div className={styles.linksBar}>
        <div className={styles.linksInner}>
          <div className={styles.linksTop}>
            <a href="#" className={styles.backHome}>Back to home page</a>
            <div className={styles.columns}>
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.heading} className={styles.column}>
                  <span className={styles.columnHeading}>{col.heading}</span>
                  {col.links.map((link) => (
                    <a key={link.label} href={link.href} className={styles.columnLink}>{link.label}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.bottomBar}>
            <div className={styles.footerLogo}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/shared/logo.svg" alt="" width={24} height={23} />
              <span className={styles.footerLogoText}>huntOS</span>
            </div>
            <span className={styles.copyright}>© 2026 huntOS.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
