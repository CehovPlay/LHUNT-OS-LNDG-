import NavBar from '@/components/shared/NavBar';
import Hero from '@/components/shared/Hero';
import SplitSection from '@/components/shared/SplitSection';
import EldProviders from '@/components/shared/EldProviders';
import Footer, { type FormField } from '@/components/shared/Footer';
import VideoBand from '@/components/shared/VideoBand';
import PartnershipAside from '@/components/marketplace/PartnershipAside';
import styles from './page.module.css';

const FIELDS: FormField[] = [
  { label: 'Email', placeholder: 'Enter your e-mail address' },
  { label: 'Company name', placeholder: 'Enter company name' },
  { label: 'USDOT', placeholder: 'Enter number' },
  { label: 'Select role', placeholder: 'Select company role', type: 'select' },
  { label: 'Which boards do you use ?', placeholder: 'Select boards', type: 'select' },
];

// Figma 3:1911 "Built where the loads actually are."
const BUILT_WHERE =
  "The freight industry doesn't run on one load board. It runs on five, plus direct broker emails, plus phone calls. Every carrier juggles them. Every dispatcher loses time switching tabs and reconciling duplicate posts.\n\nLoadhunt connects to your existing load board accounts — DAT, Truckstop, Direct Freight, Sylectus — and pulls every load you have access to into one feed. Your subscriptions stay. Your access stays. The chaos goes away.";

// Figma 3:2093 "One load, scored for you."
const ONE_LOAD =
  "Not every load is for you. The reefer headed to Memphis at $1.80/mi might be great for someone — but if your fleet runs van out of Atlanta at $2.80+, it's noise.\n\nLoadhunt's AI scores every load against the carrier looking at it. Your historical lanes. Your equipment. Your RPM thresholds. The brokers you've worked with before — and how reliably they paid. The result: a 0-10 score next to every load that tells you, in one glance, how good a match it is.\n\nYour dispatcher stops scrolling. They start picking.";

// Figma 3:2346 "Brokers can talk directly."
const BROKERS_TALK =
  "Not every load lives on a board. Many brokers post their best freight directly — via email, group chats, or to a select list of trusted carriers. That capacity is invisible to traditional load board subscribers.\n\nLoadhunt opens a direct channel. Verified brokers can post loads straight into the Marketplace, visible to carriers that match their criteria. No email chains. No screenshots. No \"let me forward this to the dispatcher.\"\n\nA new source. Surfaced the same way as everything else.";

// Figma 3:2097 "Search how you think."
const SEARCH_HOW =
  "Filters are useful — until you have to set ten of them every morning. Loadhunt accepts plain English.\n\nType \"Reefer loads from California above $3/mi with pickup this week.\" Or \"Anything dry van out of Texas paying better than market.\" The AI parses your sentence into filters and applies them. Adjust visually if needed.\n\nFaster than dropdowns. Closer to how dispatchers actually think.";

// Figma 3:2601 "Built with the boards, not against them."
const BUILT_WITH =
  "Loadhunt doesn't replace your DAT or Truckstop subscription. Your account stays exactly where it is. You keep paying them. We just make their output easier to use, alongside everything else.\n\nEvery load shows its source badge clearly — we don't erase brands. For loadboard partners willing to go deeper, we offer official API integrations with revenue-share. For carriers, it's a faster way to use what they already pay for.";

// Figma 3:2287 "Connected to the rest of the operation."
const CONNECTED =
  "Finding a load is just step one. With Loadhunt, the load you save can flow into the rest of your day.\n\nMove it into My Loads when you book. Assign it to a driver in TMS for Carriers. Track the truck via Live Tracking. Invoice the broker through Accounting. Every step inside the same workspace, with no re-entry.\n\nMarketplace is the entry point. The OS is everything that follows.";

export default function MarketplacePage() {
  return (
    <main className={styles.page}>
      <NavBar />

      {/* 3:1903 hero text + 3:2656 unified-feed dashboard */}
      <Hero
        heading={<>Every load source. One feed.<br />AI-scored for you.</>}
        subheading="Stop juggling DAT, Truckstop, Direct Freight, and broker emails. Loadhunt brings every load you have access to into one normalized feed — scored against your lanes, your equipment, your preferences."
        primaryCta={{ label: 'Join waitlist', href: '#waitlist' }}
        secondaryCta={{ label: 'See it in the demo', href: '#' }}
        image={{ src: '/assets/marketplace/hero-feed.png', alt: '' }}
      />

      {/* 3:3096 "Data Table" band — marketplace truck video */}
      <VideoBand src="/videos/marketplace-video.mp4" poster="/videos/posters/marketplace-video.jpg" />

      {/* 3:1909 — text left, unified feed diagram right */}
      <SplitSection
        title={<>Built where the loads<br />actually are.</>}
        body={BUILT_WHERE}
        image="/assets/marketplace/unified-feed.png"
      />

      {/* 3:2040 — AI score card left, text right */}
      <SplitSection
        title="One load, scored for you."
        body={ONE_LOAD}
        image="/assets/marketplace/ai-score-card.png"
        imageLeft
      />

      {/* 3:2346 — text left, broker channel mockup right */}
      <SplitSection
        title="Brokers can talk directly."
        body={BROKERS_TALK}
        image="/assets/marketplace/broker-channel.png"
      />

      {/* 3:2097 — AI search mockup left, text right */}
      <SplitSection
        title="Search how you think."
        body={SEARCH_HOW}
        image="/assets/marketplace/search-mockup.png"
        imageLeft
      />

      {/* 3:2601 — "Built with the boards" + partnership aside, board logos right */}
      <EldProviders title="Built with the boards, not against them." body={BUILT_WITH} aside={<PartnershipAside />}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/marketplace/boards-card.png" alt="" />
      </EldProviders>

      {/* 3:2286 — flow diagram left, text right */}
      <SplitSection
        title={<>Connected to the rest of<br />the operation.</>}
        body={CONNECTED}
        image="/assets/marketplace/flow-diagram.png"
        imageLeft
      />

      {/* Frame background gap between the last section (ends y8276) and the
          footer modal (y8296) — 20px of page background, per the 3:1901 frame. */}
      <div className="footerGap" />

      {/* 3:2978 — waitlist CTA + footer (modal bg fill_QIFB0L #CDCDCD) */}
      <Footer
        ctaHeading="Be the first to use it."
        ctaDescription="Loadhunt's Marketplace is rolling out to mid-fleet carriers first. Join the waitlist and we'll reach out as access opens up."
        fields={FIELDS}
        modalBg="var(--c-modal-bg-marketplace)"
      />
    </main>
  );
}
