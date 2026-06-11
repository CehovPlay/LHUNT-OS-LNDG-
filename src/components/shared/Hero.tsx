import type { ReactNode } from 'react';
import styles from './Hero.module.css';

interface CtaProps {
  label: string;
  href: string;
}

interface HeroProps {
  /** Headline (style_ESHG40 — Booton Medium 48/58). May contain line breaks. */
  heading: ReactNode;
  /** Sub-paragraph (style_Y9AAFZ — Suisse Intl 20/24). */
  subheading: string;
  /** Primary (filled) call-to-action. */
  primaryCta: CtaProps;
  /** Optional secondary (outline) call-to-action. */
  secondaryCta?: CtaProps;
  /** Right-column visual. */
  image: { src: string; alt: string };
}

// Figma 3:1056 (left text, w833) + 3:1612 "Desktop" dashboard (right, x833 w1087), y63 h813.
// Parameterized: content is supplied per-page; visual render is unchanged.
export default function Hero({ heading, subheading, primaryCta, secondaryCta, image }: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.left}>
        <h1 className={styles.heading} data-reveal>{heading}</h1>
        <p className={styles.subheading} data-reveal data-reveal-delay="1">{subheading}</p>
        <div className={styles.buttons} data-reveal data-reveal-delay="2">
          <a href={primaryCta.href} className={styles.btnPrimary}>{primaryCta.label}</a>
          {secondaryCta ? (
            <a href={secondaryCta.href} className={styles.btnSecondary}>{secondaryCta.label}</a>
          ) : null}
        </div>
      </div>

      <div className={styles.right} data-reveal data-reveal-delay="1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} className={styles.dashboard} />
      </div>
    </section>
  );
}
