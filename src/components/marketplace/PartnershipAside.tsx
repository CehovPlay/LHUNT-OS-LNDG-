import styles from './PartnershipAside.module.css';

// Figma 3:2607 "Checkbox Container" — left-column footer of the "Built with the
// boards" (ELD) section: a question label + a primary "Talk to us about
// partnership" button. Passed into the shared EldProviders `aside` slot.
export default function PartnershipAside() {
  return (
    <div className={styles.aside}>
      <p className={styles.question}>
        Are you a load board interested in deeper integration?
      </p>
      <a href="#waitlist" className={styles.button}>
        Talk to us about partnership
      </a>
    </div>
  );
}
