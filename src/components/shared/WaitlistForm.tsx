'use client';

import type { FormField } from './Footer';
import styles from './WaitlistForm.module.css';

interface WaitlistFormProps {
  fields: FormField[];
  /** Submit button label (Figma varies per page). Defaults to "Join waitlist". */
  submitLabel?: string;
}

export default function WaitlistForm({ fields, submitLabel = 'Join waitlist' }: WaitlistFormProps) {
  return (
    <form
      id="waitlist"
      className={styles.form}
      onSubmit={(e) => { e.preventDefault(); console.log('waitlist submit'); }}
    >
      <div className={styles.formFields}>
        {fields.map((f) => (
          <label key={f.id ?? f.label} className={styles.field}>
            <span className={styles.fieldLabel}>
              {f.label} <span className={styles.req}>*</span>
            </span>
            {f.type === 'select' ? (
              <div className={styles.inputWrapper}>
                <select className={styles.input} defaultValue="">
                  <option value="" disabled>{f.placeholder}</option>
                  {f.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/shared/chevron-down.svg" alt="" width={12} height={6} className={styles.selectChevron} />
              </div>
            ) : (
              <input
                type="text"
                placeholder={f.placeholder}
                className={styles.input}
              />
            )}
          </label>
        ))}
      </div>
      <div className={styles.checkboxRow}>
        <input
          type="checkbox"
          id="consent"
          className={styles.checkbox}
        />
        <label htmlFor="consent" className={styles.checkboxLabel}>
          I agree to the processing of my personal data in accordance with the Privacy Policy.
        </label>
      </div>
      <button type="submit" className={styles.submit}>{submitLabel}</button>
    </form>
  );
}
