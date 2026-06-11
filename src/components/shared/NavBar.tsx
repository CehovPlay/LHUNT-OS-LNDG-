import styles from './NavBar.module.css';

// Figma node 3:3071 / 3:1876 — "Navigation bar" (identical across all pages)
const LINKS: { label: string; href: string }[] = [
  { label: 'Home',      href: '/' },
  { label: 'Products',  href: '/#products' },
  { label: 'Solutions', href: '/#who' },
  { label: 'Articles',  href: '/#waitlist' },
  { label: 'Company',   href: '/#contact' },
];

export default function NavBar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logoContainer}>
        <a href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/shared/logo.svg" alt="" width={24} height={24} className={styles.logoMark} />
          <span className={styles.logoText}>huntOS</span>
        </a>
      </div>

      <nav className={styles.links}>
        {LINKS.map(({ label, href }, i) => (
          <a
            href={href}
            key={label}
            className={`${styles.linkBtn} ${i === 0 ? styles.linkBtnFirst : ''} ${
              label === 'Products' ? styles.linkBtnProducts : ''
            }`}
          >
            {label}
            {label === 'Products' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/assets/shared/chevron-down.svg" alt="" width={9} height={4} className={styles.chevron} />
            )}
          </a>
        ))}
      </nav>
    </header>
  );
}
