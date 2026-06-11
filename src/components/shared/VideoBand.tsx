import VideoBlock from '@/components/shared/VideoBlock';
import styles from './VideoBand.module.css';

interface VideoBandProps {
  src: string;
  poster: string;
  /** When true, renders a white wash overlay (accounting style). */
  wash?: boolean;
}

// Shared 1920x920 video band — Figma layout_BA8DJ1.
// Accounting uses wash=true (heavy white veil); Marketplace omits it.
// Videos always autoplay; pixel-verify determinism is handled in the harness.
export default function VideoBand({ src, poster, wash = false }: VideoBandProps) {
  return (
    <div className={styles.band} data-reveal>
      <VideoBlock
        src={src}
        poster={poster}
        width={1920}
        height={920}
        className={styles.video}
      />
      {wash && <div className={styles.wash} />}
    </div>
  );
}
