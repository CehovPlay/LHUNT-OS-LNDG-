import NavBar from '@/components/shared/NavBar';
import EldProviders from '@/components/shared/EldProviders';
import Footer, { type FormField } from '@/components/shared/Footer';
import Hero from '@/components/shared/Hero';
import SplitSection from '@/components/shared/SplitSection';
import ModuleSection from '@/components/shared/ModuleSection';
import VideoBand from '@/components/shared/VideoBand';
import styles from './page.module.css';

const FIELDS: FormField[] = [
  { label: 'Email', placeholder: 'Enter your e-mail address' },
  { label: 'Company name', placeholder: 'Enter company name' },
  { label: 'USDOT', placeholder: 'Enter number' },
  { label: 'Select role', placeholder: 'Select company role', type: 'select' },
  { label: 'Current accounting using ?', placeholder: 'Select accounting', type: 'select' },
  { label: 'Current factoring using ?', placeholder: 'Select factoring', type: 'select' },
];

const AFTER_DELIVERED =
  "A carrier doesn't get paid when the freight arrives. They get paid 30, 45, sometimes 60 days later — after generating an invoice, sending it to the broker, following up if it gets ignored, escalating if it goes overdue, possibly involving a factoring company to bridge the gap.\n\nToday, this happens in QuickBooks. Or Excel. Or in a folder of email attachments. None of which know that the load was delivered, who the broker was, or whether the carrier's been paid by them before.\n\nLoadhunt's Accounting module knows. Because the load just came from the same workspace.";

const ONE_CLICK =
  "Every completed load in Loadhunt carries everything an invoice needs: broker info, rate, accessorials, supporting documents (Rate Conf, BOL, POD). When you mark a load as delivered, the invoice can generate itself — pre-filled, ready to send.\n\nEdit before sending if you need. Auto-send if you've set rules. Once the broker pays, the load record updates to \"Paid.\" No re-entry. No transcription errors.";

const KNOW_WHO_PAYS =
  "Every carrier has a list of brokers they avoid. The ones who pay late. The ones who dispute charges. The ones who disappear after delivery. But those lists live in dispatchers' heads — and they don't transfer.\n\nLoadhunt tracks broker payment behavior automatically. For each broker you've worked with: average days to pay. Dispute rate. Total revenue. Outstanding balance. So when a great-looking load shows up from a broker who's burned you twice, the warning is right there.\n\nOver time, this data aggregates across the network. The brokers who pay reliably build reputation. The ones who don't, can't hide.";

const FACTORING =
  'Many carriers use factoring companies — they sell their invoice for a small discount and get paid in 24 hours instead of 30 days. The relationships are usually established outside the operational platform: carrier signs up with TBS, OTR, Apex, or Triumph, then manually submits invoices through that company\'s portal.\n\nLoadhunt is building direct integrations. A carrier with a connected factoring partner sees a "Factor this invoice" button on every invoice they generate. One click. Money arrives next day. Same workspace.';

const SETTLEMENTS =
  "For carriers running with drivers (not just owner-operators), settlements live alongside accounting. Per-mile pay. Bonuses. Deductions. Weekly or bi-weekly closeouts. Today, this is usually Excel.\n\nLoadhunt's Accounting module calculates settlements from delivered loads automatically. Each driver sees their statement. The carrier issues payment. The record stays in the workspace, alongside the loads that generated it.";

const PARTNERS =
  "Factoring is a fragmented industry — carriers shop between TBS, OTR, Apex, Triumph and dozens of smaller companies. Each factoring partner has their own portal, their own onboarding, their own invoice submission process.\n\nLoadhunt offers factoring partners a direct integration into the carrier's workspace. Verified carrier data. Verified load data. Verified delivery documents. Less fraud risk. Faster onboarding. Higher carrier retention.";

export default function AccountingPage() {
  return (
    <main className={styles.page}>
      <NavBar />
      <Hero
        heading={<>Money flow, where load<br />flow lives.</>}
        subheading="Generate invoices from completed loads. Track which brokers pay on time. Connect factoring partners for faster payouts. All inside the same workspace."
        primaryCta={{ label: 'Join waitlist', href: '#waitlist' }}
        secondaryCta={{ label: 'Factoring partnership', href: '#' }}
        image={{ src: '/assets/accounting/hero-dashboard.png', alt: '' }}
      />
      <VideoBand src="/videos/accounting-video.mp4" poster="/assets/shared/data-table-accounting.png" wash />

      {/* 3:1062 — text left, steps right */}
      <SplitSection
        title={<>After the load is delivered, the<br />work continues.</>}
        body={AFTER_DELIVERED}
        image="/assets/accounting/steps.png"
      />

      {/* 3:1121 — invoice card left, text right */}
      <SplitSection
        title="One click from load to invoice."
        body={ONE_CLICK}
        image="/assets/accounting/invoice-card.png"
        imageLeft
      />

      {/* 3:1413 — text left, broker cards right */}
      <SplitSection
        title="Know who actually pays."
        body={KNOW_WHO_PAYS}
        image="/assets/accounting/broker-cards.png"
      />

      {/* 3:1192 — factoring card left, text right */}
      <SplitSection
        title={<>Factoring, when you need<br />cash sooner.</>}
        body={FACTORING}
        image="/assets/accounting/factoring-card.png"
        imageLeft
      />

      {/* 3:1498 — Driver settlements (shared EldProviders) */}
      <EldProviders title="Driver settlements, too." body={SETTLEMENTS}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/accounting/settlements-table.png" alt="" />
      </EldProviders>

      {/* 3:1269 — partners diagram left, text right */}
      <SplitSection
        title="Built for factoring partners."
        body={PARTNERS}
        image="/assets/accounting/partners-diagram.png"
        imageLeft
      />

      {/* 3:1608 — Accounting is a module */}
      <ModuleSection
        title="Accounting is a module."
        description={
          <>
            Loadhunt is modular. You don&apos;t have to use Accounting from day one — many
            carriers start with Marketplace and TMS,<br />then activate Accounting when
            they&apos;re ready to consolidate the financial side of operations.
            {'\n\n'}
            The data still flows. When you turn it on, every prior load is ready to invoice from.
          </>
        }
      />

      {/* 3:1782 — waitlist CTA + footer */}
      <Footer
        ctaHeading="Be ready when it opens."
        ctaDescription="Accounting rolls out as part of our TMS module after the core Marketplace launch. Join the waitlist to be notified."
        fields={FIELDS}
      />
    </main>
  );
}
