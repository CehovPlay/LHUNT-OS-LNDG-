import NavBar from '@/components/shared/NavBar';
import Hero from '@/components/shared/Hero';
import SplitSection from '@/components/shared/SplitSection';
import EldProviders from '@/components/shared/EldProviders';
import ModuleSection from '@/components/shared/ModuleSection';
import Footer, { type FormField } from '@/components/shared/Footer';
import VideoBand from '@/components/shared/VideoBand';
import styles from './page.module.css';

// Figma 3:4255 footer waitlist fields (Input with label nodes).
const FIELDS: FormField[] = [
  { label: 'Email', placeholder: 'Enter your e-mail address' },
  { label: 'Company name', placeholder: 'Enter company name' },
  { label: 'USDOT', placeholder: 'Enter number' },
  { label: 'Brokerage type', placeholder: 'Select type', type: 'select' },
  { label: 'Loads brokered per month', placeholder: 'Select range', type: 'select' },
  { label: 'Primary lanes or regions', placeholder: 'Select regions or lanes', type: 'select' },
  { label: "What's most painful in your booking process today?", placeholder: 'Enter text' },
];

// Figma 3:3110 "How brokers move freight today."
const HOW_BROKERS =
  "Most brokerage operations run on three things: a TMS that tracks the financial side, a network of trusted carriers built over years, and an email inbox.\n\nWhen a broker has a load to move quickly, they screenshot it. Forward it to a chain of dispatchers. Wait for replies. Negotiate by phone. Check the carrier's MC number on their own. Then track the load by calling the driver every 4 hours.\n\nThis works. It also costs hours per load and depends entirely on personal relationships.";

// Figma 3:3194 "Direct posts, verified carriers."
const DIRECT_POSTS =
  "Loadhunt's broker workspace lets you post a load directly to the Marketplace — visible to carriers whose lanes, equipment, and history match your needs. No screenshots. No forwards.\n\nEvery carrier in the Loadhunt network is FMCSA-verified at registration. Authority active, insurance current, safety rating in range. You see only the carriers you'd actually approve.";

// Figma 3:3629 "Track without calling."
const TRACK =
  "When one of your loads is in transit with a Loadhunt carrier, you see it live. Truck location pulled from the carrier's ELD. ETA calculated from current speed and HOS remaining. Updates without a phone call.\n\nYour shipper asks where the truck is — you know before they ask.";

// Figma 3:3485 "Booking is a workflow, not an email."
const BOOKING =
  'Once a carrier accepts your load, the booking happens inside Loadhunt. Rate confirmation generated automatically. Carrier signs digitally. Document attached to the load record. Both sides see the same status.\n\nNo PDF email attachments. No "did you send the rate con yet?" No paperwork lost in spam folders.';

// Figma 3:3724 "Reputation that travels with the carrier."
const REPUTATION =
  "Over time, every shipment generates signal. On-time pickup. On-time delivery. Document compliance. Communication quality. Loadhunt builds a reputation profile around each carrier — based on operational reality, not reviews you have to chase.\n\nWhen you post your next load, the carriers you see have track records, not just MC numbers. You make decisions on data, not on faith.";

export default function TmsForBrokersPage() {
  return (
    <main className={styles.page}>
      <NavBar />

      {/* 3:3099 hero text + 3:3947 "Desktop" dashboard */}
      <Hero
        heading={<>The brokerage workspace built on a verified carrier network.</>}
        subheading="Post directly to carriers who match your loads. Get live tracking through their ELDs. Skip the email chains. Coming with Phase 4 of Loadhunt."
        primaryCta={{ label: 'Join waitlist', href: '#waitlist' }}
        secondaryCta={{ label: 'Read about Loadhunt', href: '#' }}
        image={{ src: '/assets/tms-for-brokers/hero-dashboard.png', alt: '' }}
      />

      {/* 3:4376 "Data Table" band — brokers warehouse video */}
      <VideoBand src="/videos/tms-for-broker-video.mp4" poster="/videos/posters/tms-for-broker-video.jpg" />

      {/* 3:3105 — text left, email-thread cards right */}
      <SplitSection
        title={<>How brokers move<br />freight today.</>}
        body={HOW_BROKERS}
        image="/assets/tms-for-brokers/email-cards.png"
      />

      {/* 3:3194 — carrier-match card left, text right */}
      <SplitSection
        title="Direct posts, verified carriers."
        body={DIRECT_POSTS}
        image="/assets/tms-for-brokers/carrier-match.png"
        imageLeft
      />

      {/* 3:3629 — text left, live-tracking map right */}
      <SplitSection
        title="Track without calling."
        body={TRACK}
        image="/assets/tms-for-brokers/map-tracking.png"
      />

      {/* 3:3485 — booking-flow card left, text right */}
      <SplitSection
        title={<>Booking is a workflow,<br />not an email.</>}
        body={BOOKING}
        image="/assets/tms-for-brokers/booking-flow.png"
        imageLeft
      />

      {/* 3:3724 — "Reputation that travels" + carrier reputation table (shared EldProviders) */}
      <EldProviders
        title={<>Reputation that travels with<br />the carrier.</>}
        body={REPUTATION}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/tms-for-brokers/reputation-table.png" alt="" />
      </EldProviders>

      {/* 3:4377 — "Why this matters." centered module */}
      <ModuleSection
        title="Why this matters."
        description={
          <>
            Today, brokers compete on relationships and speed. The brokerage that can call ten
            dispatchers in five minutes wins.{'\n\n'}Tomorrow, brokers will compete on quality of
            network. The brokerage that knows exactly which carriers to call — verified, reliable,
            currently available — wins faster, with less risk, and with less broken capacity.
            {'\n\n'}Loadhunt is building that network now. Brokers who join the waitlist early get
            the first looks.
          </>
        }
      />

      {/* 3:4255 — waitlist CTA + footer (modal bg = --c-modal-bg-default, same as accounting) */}
      <Footer
        ctaHeading="Get early broker access."
        ctaDescription="The Loadhunt broker workspace is in active development. Join the waitlist to be among the first brokerages invited."
        fields={FIELDS}
        submitLabel="Join broker waitlist"
      />
    </main>
  );
}
