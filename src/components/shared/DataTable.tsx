import styles from './DataTable.module.css';

interface DataTableProps {
  /** Per-page background image (1920x920 export from Figma). */
  src: string;
  alt?: string;
  height: number;
  className?: string;
}

// Figma node 3:1781 / 3:3096 — "Data Table" frame 1920x920, IMAGE fill (FILL/cover).
// Content differs per page, so the image source is a prop.
export default function DataTable({ src, alt = 'Data table', height, className }: DataTableProps) {
  return (
    <div className={`${styles.table} ${className ?? ''}`} style={{ height: height }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className={styles.image} />
    </div>
  );
}
