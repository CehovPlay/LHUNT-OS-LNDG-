import styles from './EldPartnershipAside.module.css';

// Figma 3:5956 "Checkbox Container" — left-column footer of the "Built with ELD
// providers." section: a separator, a question label, and a primary "Get in
// touch" button. Passed into the shared EldProviders `aside` slot.
export default function EldPartnershipAside() {
  return (
    <div className={styles.aside}>
      <hr className={styles.separator} />
      <p className={styles.question}>
        Are you an ELD provider interested in deeper partnership?
      </p>
      <a href="#waitlist" className={styles.button}>
        Get in touch
      </a>
    </div>
  );
}
