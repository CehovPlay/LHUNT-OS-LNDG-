import type { ReactNode } from 'react';
import styles from './EldProviders.module.css';

interface EldProvidersProps {
  /** Left-column heading (style_ESHG40 — Booton Medium 48/58). */
  title: ReactNode;
  /** Left-column body paragraph(s) (style_Y9AAFZ — Suisse Intl 20/24).
   *  Accepts a ReactNode so pages can embed inline links (e.g. ts4 underline). */
  body: ReactNode;
  /** Page-specific right-column visual (table / providers grid / image). */
  children?: ReactNode;
  /** Optional extra content rendered below the body in the left column
   *  (e.g. Marketplace's partnership checkbox + button). Default: none. */
  aside?: ReactNode;
  className?: string;
}

// Figma node 3:1498 / 3:2601 — "Built with ELD providers" section.
// Two columns: text (left) + page-specific visual (right). 1920 wide, bottom border.
// Content varies per page (Accounting: "Driver settlements, too." + settlements table),
// so heading/body/visual are props.
export default function EldProviders({ title, body, children, aside, className }: EldProvidersProps) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      <div className={styles.left}>
        <div className={styles.textBlock}>
          <h2 className={styles.title} data-reveal>{title}</h2>
          <hr className={styles.separator} />
          <div className={styles.body} data-reveal data-reveal-delay="1">{body}</div>
          {aside ? <div data-reveal data-reveal-delay="2">{aside}</div> : null}
        </div>
      </div>
      <div className={styles.right} data-reveal data-reveal-delay="1">{children}</div>
    </section>
  );
}
