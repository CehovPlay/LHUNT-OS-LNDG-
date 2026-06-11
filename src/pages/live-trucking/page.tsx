import NavBar from '@/components/shared/NavBar';
import Hero from '@/components/shared/Hero';
import SplitSection from '@/components/shared/SplitSection';
import EldProviders from '@/components/shared/EldProviders';
import VideoBand from '@/components/shared/VideoBand';
import Footer, { type FormField } from '@/components/shared/Footer';
import EldPartnershipAside from '@/components/live-trucking/EldPartnershipAside';
import styles from './page.module.css';

// Figma 3:6288 footer waitlist fields (Input-with-label nodes).
const FIELDS: FormField[] = [
  { label: 'Email', placeholder: 'Enter your e-mail address' },
  { label: 'Company name', placeholder: 'Enter company name' },
  { label: 'USDOT', placeholder: 'Enter number' },
  { label: 'Select role', placeholder: 'Select company role', type: 'select' },
  { label: 'Which ELD do you use?', placeholder: 'Select your ELD provider', type: 'select' },
  { label: 'Fleet size', placeholder: 'Select your fleet size', type: 'select' },
];

// Figma 3:5536 "ELD data lives in another app. Until now."
const ELD_DATA =
  'Every modern carrier runs an ELD — Samsara, Motive, Geotab, Omnitracs. Each platform is excellent at what it does: HOS compliance, GPS tracking, vehicle health, driver coaching.\n\nBut these platforms live separately from the rest of the operation. A dispatcher answering "where\'s the truck?" opens a third tab. A broker asking for ETA hears "let me check and get back to you." A driver who needs reassignment has their HOS status in one system and their current load in another.\n\nLoadhunt brings ELD data into the same workspace where loads, drivers, and accounting already live. Your ELD provider stays your ELD provider. The data just becomes visible everywhere it\'s needed.';

// Figma 3:5768 "Every truck. Every status. One screen."
const EVERY_TRUCK =
  "Loadhunt's Live Tracking view shows your entire fleet on one map. Each truck represented by a pin — color-coded by status. Driving. On duty. Off duty. Sleeper berth. Idle.\n\nClick a pin and you see everything that matters: driver name, current load, HOS hours remaining, ETA to next destination, last GPS update, ELD provider.\n\nFilter by status. Filter by region. Filter by load. The view adapts to whatever question you're answering right now.";

// Figma 3:5909 "HOS, where dispatchers can see it."
const HOS =
  "Hours of Service compliance is critical, and carriers already track it through ELD. But the dispatcher assigning the next load usually doesn't see HOS clocks live — they ask, get an outdated answer, and assign anyway.\n\nLoadhunt pulls HOS directly from the ELD into the assignment workflow. When you try to assign a load to a driver, you see their available hours instantly. When a driver approaches HOS limits mid-route, an alert surfaces — to the dispatcher, not just to the driver.\n\nCompliance becomes operational, not just regulatory.";

// Figma 3:5769 "ETA without the phone call."
const ETA =
  'When a load is in transit, the question on everyone\'s mind is the same: when does it arrive? Today, that question gets answered by a phone call. Driver picks up (or doesn\'t). Says "couple hours, traffic\'s bad."\n\nLoadhunt calculates ETA from live GPS, current speed, remaining HOS, and known stop patterns. The number updates as the truck moves. Your dispatcher sees it. Your broker sees it (when they\'re on the broker module). Your customer sees it (when you choose to share).\n\nPhones still exist. They\'re just not the source of truth anymore.';

// Figma 3:5953 "Built with ELD providers."
const BUILT_WITH =
  "We don't compete with ELDs. We integrate with them. Loadhunt's tracking module uses read-only API access provided by the carrier — meaning your existing ELD subscription stays, your data stays with your ELD vendor, and Loadhunt acts as a unified visibility layer on top.\n\nFor ELD providers, this means carrier customers don't churn — they gain a reason to stay subscribed. For carriers, it means no ELD migration, no vendor lock-in, no data fights.";

// Figma 3:5864 "Tracking is one module of many." — body has ts7 UNDERLINE links.
const TRACKING = (
  <>
    Live Tracking gets more powerful when paired with the rest of Loadhunt. The truck on the
    map is the same truck assigned in{' '}
    <a href="/tms-for-carriers/" className={styles.link}>TMS for Carriers</a>. The load it&apos;s
    carrying came from <a href="/marketplace/" className={styles.link}>Marketplace</a>. When
    delivered, the invoice fires in{' '}
    <a href="/accounting/" className={styles.link}>Accounting</a>.
    {'\n\n'}
    A standalone tracking dashboard answers &quot;where&apos;s the truck?&quot; A connected
    workspace answers &quot;where&apos;s the truck, who&apos;s driving, what load, when&apos;s it
    delivered, did we invoice, did we get paid?&quot;
  </>
);

export default function LiveTruckingPage() {
  return (
    <main className={styles.page}>
      <NavBar />

      {/* 3:5528 hero text + 3:6009 "Desktop" fleet-map dashboard */}
      <Hero
        heading={<>Your fleet on a map.<br />Powered by your ELD.</>}
        subheading="Live tracking through Samsara, Motive, Geotab, and other ELD providers — built into your Loadhunt workspace. See every truck, every load, every HOS clock without switching apps."
        primaryCta={{ label: 'Join waitlist', href: '#waitlist' }}
        secondaryCta={{ label: 'Partnership inquiry', href: '#' }}
        image={{ src: '/assets/live-trucking/hero-dashboard.png', alt: '' }}
      />

      {/* 3:6287 "Data Table" band — live trucking highway video */}
      <VideoBand src="/videos/livetraking-video.mp4" poster="/videos/posters/livetraking-video.jpg" />

      {/* 3:5534 — text left, ELD-logos + map mockup right */}
      <SplitSection
        title={<>ELD data lives in another app.<br />Until now.</>}
        body={ELD_DATA}
        image="/assets/live-trucking/eld-map.png"
      />

      {/* 3:5656 — full fleet map left, text right */}
      <SplitSection
        title={<>Every truck. Every status.<br />One screen.</>}
        body={EVERY_TRUCK}
        image="/assets/live-trucking/fleet-map.png"
        imageLeft
      />

      {/* 3:5905 — text left, driver-assignment card right */}
      <SplitSection
        title={<>HOS, where dispatchers<br />can see it.</>}
        body={HOS}
        image="/assets/live-trucking/driver-assignment.png"
      />

      {/* 3:5769 — live-tracking map left, text right */}
      <SplitSection
        title="ETA without the phone call."
        body={ETA}
        image="/assets/live-trucking/eta-map.png"
        imageLeft
      />

      {/* 3:5949 — "Built with ELD providers." + partnership aside, integration card right */}
      <EldProviders
        title="Built with ELD providers."
        body={BUILT_WITH}
        aside={<EldPartnershipAside />}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/live-trucking/integration-card.png" alt="" />
      </EldProviders>

      {/* 3:5864 — module flow diagram left, text right (ts7 underline links) */}
      <SplitSection
        title={<>Tracking is one module<br />of many.</>}
        body={TRACKING}
        image="/assets/live-trucking/module-flow.png"
        imageLeft
        border={false}
      />

      {/* Frame 3:5526 background gap between the last split (ends y8276) and the
          footer modal (y8296) — 20px of page background. */}
      <div className="footerGap" />

      {/* 3:6288 — waitlist CTA + footer (modal bg #CDCDCD = --c-modal-bg-marketplace) */}
      <Footer
        ctaHeading="See your fleet in Loadhunt."
        ctaDescription="Live Tracking is part of our TMS module rolling out after the core Marketplace. Join the waitlist if you want to be notified."
        fields={FIELDS}
        modalBg="var(--c-modal-bg-marketplace)"
      />
    </main>
  );
}
