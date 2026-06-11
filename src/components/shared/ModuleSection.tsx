import type { ReactNode } from 'react';
import styles from './ModuleSection.module.css';

interface ModuleSectionProps {
  /** Centered heading (style_DAABY0 — Booton Medium 48/58). */
  title: string;
  /** Centered body copy (style_2V7AJQ — Suisse 20/24). May contain line breaks. */
  description: ReactNode;
}

// Figma 3:1608 — centered text block, padding 200 vertical, 1920 wide. y8276 h634.
// Parameterized: content supplied per-page; visual render is unchanged.
export default function ModuleSection({ title, description }: ModuleSectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.group}>
        <h2 className={styles.title} data-reveal>{title}</h2>
        <p className={styles.description} data-reveal data-reveal-delay="1">{description}</p>
      </div>
    </section>
  );
}
