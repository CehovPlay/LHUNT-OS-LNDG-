import styles from './VideoBlock.module.css';

interface VideoBlockProps {
  src: string;
  poster?: string;
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  className?: string;
}

// Autoplaying, muted, looping video. Container sizing is supplied per page.
// Deterministic poster frames for pixel-verify are handled in the harness
// (scripts/verify.mjs) by calling load() without autoplay after page load.
export default function VideoBlock({
  src,
  poster,
  width,
  height,
  borderRadius,
  className,
}: VideoBlockProps) {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      src={src}
      className={`${styles.video} ${className ?? ''}`}
      style={{ width, height, borderRadius }}
    />
  );
}
