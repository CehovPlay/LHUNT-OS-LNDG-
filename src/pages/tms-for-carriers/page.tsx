import NavBar from '@/components/shared/NavBar';
import Hero from '@/components/shared/Hero';
import SplitSection from '@/components/shared/SplitSection';
import EldProviders from '@/components/shared/EldProviders';
import VideoBand from '@/components/shared/VideoBand';
import Footer, { type FormField } from '@/components/shared/Footer';
import styles from './page.module.css';

// Figma 3:5399 reuses the BROKER footer fields verbatim (copy slip in the mockup).
// Deliberate deviation from Figma (agreed with Yaroslav 2026-06-12): fields adapted
// to carrier logic; structure/layout unchanged. Update Figma to match.
const FIELDS: FormField[] = [
  { label: 'Email', placeholder: 'Enter your e-mail address' },
  { label: 'Company name', placeholder: 'Enter company name' },
  { label: 'USDOT', placeholder: 'Enter number' },
  { label: 'Equipment type', placeholder: 'Select type', type: 'select' },
  { label: 'Trucks in your fleet', placeholder: 'Select range', type: 'select' },
  { label: 'Primary lanes or regions', placeholder: 'Select regions or lanes', type: 'select' },
  { label: "What's most painful in your dispatch today?", placeholder: 'Enter text' },
];

// Figma 3:4389 "Dispatch lives in spreadsheets. Until now."
const DISPATCH =
  "Most mid-fleet carriers (10-100 trucks) don't have a real TMS. They have a dispatcher with a phone, a spreadsheet of drivers, and a whiteboard with truck assignments. It works — until something breaks. A driver runs out of hours mid-route. A truck needs unscheduled maintenance. A broker calls asking for an updated ETA.\n\nThe information is everywhere. Or nowhere. Usually both.\n\nLoadhunt's TMS module pulls dispatch into the same workspace where loads are found. Drivers, trucks, trailers, current assignments — visible at a glance. Connected to live tracking. Connected to the loads they're carrying. Connected to the invoice that's about to be generated.";

// Figma 3:4495 "Drivers, not entries."
const DRIVERS =
  'Each driver in Loadhunt is a real profile. CDL info. Hours of service status (pulled live from your ELD). Current location. Current load assignment. Maintenance and compliance documents. Notes from past trips.\n\nWhen you reassign a load, you see who\'s eligible — not just who\'s "around." When HOS hits a warning level, the assignment system knows before the driver does. When a broker needs an ETA, your dispatcher already has it.';

// Figma 3:4706 "Trucks and trailers, on the platform."
const TRUCKS =
  'Every vehicle is tracked. VIN, year, model. Current odometer (from ELD). Days since last service. Insurance and registration expirations. Currently assigned driver. Currently assigned load.\n\nWhen a truck approaches a service interval, Loadhunt flags it. When registration is about to expire, you see it before DOT does. When you assign a load, the system knows which trucks are available and which need attention.';

// Figma 3:4586 "Documents, where they're needed."
const DOCUMENTS =
  "Rate confirmations, bills of lading, proofs of delivery — every load generates paperwork. Today, that paperwork lives in email threads, photos on a phone, and PDF folders no one can find again.\n\nLoadhunt attaches documents to the load that generated them. Rate Conf signed when the load was booked. BOL uploaded when the driver picked up. POD uploaded when delivered. Each visible on the load's record. Each ready to generate an invoice from.";

// Figma 3:4649 "TMS is a module."
const MODULE =
  "Loadhunt is modular. Some carriers start with just Marketplace — they want a better way to find loads, nothing else. Others activate TMS from day one.\n\nActivate it when you're ready. Deactivate if it doesn't fit. We don't push a one-size product.";

// Figma 3:4800 "Connected to everything else." — body has ts4 UNDERLINE links.
const CONNECTED = (
  <>
    A Loadhunt TMS isn&apos;t a separate app you log into. It&apos;s the same workspace.
    {'\n\n'}
    The load you saved in{' '}
    <a href="/marketplace/" className={styles.link}>Marketplace</a> becomes the load you dispatch here. The
    driver you assign here shows up on{' '}
    <a href="/live-trucking/" className={styles.link}>Live Tracking</a>. The completed load you mark here
    generates an invoice in <a href="/accounting/" className={styles.link}>Accounting</a>.
    {'\n\n'}
    No re-entry. No syncing. One state, one workflow.
  </>
);

export default function TmsForCarriersPage() {
  return (
    <main className={styles.page}>
      <NavBar />

      {/* 3:4383 hero text + 3:4860 "Desktop" dashboard */}
      <Hero
        heading={<>Your fleet operations.<br />Inside your workspace.</>}
        subheading="Drivers, trucks, trailers, assignments, document handling. The work that happens after a load is booked — finally in the same place where you booked it."
        primaryCta={{ label: 'Join waitlist', href: '#waitlist' }}
        secondaryCta={{ label: 'Read about Loadhunt', href: '#' }}
        image={{ src: '/assets/tms-for-carriers/hero-dashboard.png', alt: '' }}
      />

      {/* 3:5398 "Data Table" band — carriers highway video */}
      <VideoBand src="/videos/tms-for-carriers-video.mp4" poster="/videos/posters/tms-for-carriers-video.jpg" />

      {/* 3:4389 — text left, dispatch workspace mockup right */}
      <SplitSection
        title={<>Dispatch lives in spreadsheets.<br />Until now.</>}
        body={DISPATCH}
        image="/assets/tms-for-carriers/dispatch-workspace.png"
      />

      {/* 3:4495 — driver-card mockup left, text right */}
      <SplitSection
        title="Drivers, not entries."
        body={DRIVERS}
        image="/assets/tms-for-carriers/driver-card.png"
        imageLeft
      />

      {/* 3:4706 — text left, trucks & trailers table right */}
      <SplitSection
        title={<>Trucks and trailers,<br />on the platform.</>}
        body={TRUCKS}
        image="/assets/tms-for-carriers/trucks-table.png"
      />

      {/* 3:4586 — documents card left, text right */}
      <SplitSection
        title={<>Documents, where<br />they&apos;re needed.</>}
        body={DOCUMENTS}
        image="/assets/tms-for-carriers/documents-card.png"
        imageLeft
      />

      {/* 3:4800 — "Connected to everything else." + flow diagram (shared EldProviders) */}
      <EldProviders title={<>Connected to<br />everything else.</>} body={CONNECTED}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/tms-for-carriers/connected-diagram.png" alt="" />
      </EldProviders>

      {/* 3:4649 — module flow diagram left, text right */}
      <SplitSection
        title="TMS is a module."
        body={MODULE}
        image="/assets/tms-for-carriers/module-flow.png"
        imageLeft
      />

      {/* Frame background gap between the last split (ends y8276) and the footer
          modal (y8296) — 20px of page background, per the 3:4381 frame. */}
      <div className="footerGap" />

      {/* 3:5399 — waitlist CTA + footer (modal bg #B9B9B9 = --c-modal-bg-default) */}
      <Footer
        ctaHeading="Try it when it opens."
        ctaDescription="TMS for Carriers is rolling out after our core Marketplace launch. Drop your email and we'll let you know."
        fields={FIELDS}
        submitLabel="Join carrier waitlist"
      />
    </main>
  );
}
