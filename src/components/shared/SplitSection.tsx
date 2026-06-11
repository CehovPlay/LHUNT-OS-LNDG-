import type { ReactNode } from 'react';
import styles from './SplitSection.module.css';

interface SplitSectionProps {
  title: ReactNode;
  /** Body paragraphs. A plain string keeps the `\n\n` → pre-line behaviour;
   *  a ReactNode lets pages embed inline links (e.g. ts4/ts7 underline). */
  body: string | ReactNode;
  /** Exported Figma half-frame image (961x1080). */
  image: string;
  /** Alt text for the image (defaults to empty string). */
  alt?: string;
  /** When true, image is on the left and text on the right. */
  imageLeft?: boolean;
  /** Render a bottom border (most mid sections have one). */
  border?: boolean;
}

// Reusable 1920x1080 two-column section: text block (959) + visual half (961).
// Covers nodes 3:1062, 3:1121, 3:1413, 3:1192 (Accounting page mid sections).
export default function SplitSection({
  title,
  body,
  image,
  alt = '',
  imageLeft = false,
  border = true,
}: SplitSectionProps) {
  const text = (
    <div className={styles.textHalf}>
      <div className={styles.textBlock}>
        <h2 className={styles.title} data-reveal>{title}</h2>
        <hr className={styles.separator} />
        <p className={styles.body} data-reveal data-reveal-delay="1">{body}</p>
      </div>
    </div>
  );

  const visual = (
    <div className={styles.imageHalf} data-reveal data-reveal-delay="1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt={alt} className={styles.image} />
    </div>
  );

  return (
    <section className={`${styles.section} ${border ? styles.bordered : ''}`}>
      {imageLeft ? (
        <>
          {visual}
          {text}
        </>
      ) : (
        <>
          {text}
          {visual}
        </>
      )}
    </section>
  );
}
