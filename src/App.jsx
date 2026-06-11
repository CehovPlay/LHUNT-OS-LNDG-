import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import ProductLayout from "./layouts/ProductLayout.jsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const SEQUENCES = [
  { folder: "/frames", count: 97 },
  { folder: "/frames-2", count: 97 },
  { folder: "/frames-3", count: 97 },
  { folder: "/frames-4", count: 97 },
];

const TOTAL_FRAMES = SEQUENCES.reduce((sum, sequence) => sum + sequence.count, 0);

function buildFrameList() {
  return SEQUENCES.flatMap((sequence) =>
    Array.from({ length: sequence.count }, (_, index) => {
      const file = `frame-${String(index + 1).padStart(4, "0")}.jpg`;
      return `${sequence.folder}/${file}`;
    })
  );
}

function getSequenceRanges() {
  let start = 0;

  return SEQUENCES.map((sequence) => {
    const range = {
      start,
      end: start + sequence.count - 1,
      count: sequence.count,
    };

    start += sequence.count;
    return range;
  });
}



function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const productLinks = [
    { name: "Marketplace", description: "Every load source, one feed", href: "/marketplace" },
    { name: "TMS for Carriers", description: "Drivers, trucks, dispatch", href: "/tms-for-carriers" },
    { name: "TMS for Brokers", description: "Direct posting & matching", status: "Coming soon", href: "/tms-for-brokers" },
    { name: "Live Tracking", description: "ELD-powered fleet visibility", href: "/live-trucking" },
    { name: "Accounting", description: "Invoices, settlements, factoring", href: "/accounting" },
    { name: "$LHUNT", description: "The token aligning the network", href: "#" },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-inner">
        <a className="navbar-brand" href="#top" aria-label="huntOS home">
          <img className="navbar-logo-img" src="/huntos-icon.svg" alt="" aria-hidden="true" />
          <b>huntOS</b>
        </a>

        <nav className="navbar-menu" aria-label="Main navigation">
          <a className="navbar-link" href="#top">Home</a>

          <div className="navbar-dd">
            <a className="navbar-link navbar-dd-trigger" href="#products">
              Products
              <svg className="navbar-caret" viewBox="0 0 12 12" aria-hidden="true">
                <path
                  d="M3 4.5 L6 7.5 L9 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <div className="navbar-panel">
              <div className="navbar-panel-grid">
                {productLinks.map((product) => (
                  <a className="navbar-panel-link" href={product.href} key={product.name}>
                    <span className="navbar-panel-name">
                      {product.name}
                      {product.status && <em>{product.status}</em>}
                    </span>
                    <span className="navbar-panel-desc">{product.description}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a className="navbar-link" href="#solutions">Solutions</a>
          <a className="navbar-link" href="#articles">Articles</a>
          <a className="navbar-link" href="#contact">Company</a>
        </nav>

        <button
          className={`navbar-burger ${mobileOpen ? "is-open" : ""}`}
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`navbar-mobile ${mobileOpen ? "is-open" : ""}`}>
        <a href="#top" onClick={closeMobile}>Home</a>
        <a href="#products" onClick={closeMobile}>Products</a>
        <a href="#solutions" onClick={closeMobile}>Solutions</a>
        <a href="#articles" onClick={closeMobile}>Articles</a>
        <a href="#contact" onClick={closeMobile}>Company</a>
      </div>
    </header>
  );
}

function HeroSequence() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const frameRef = useRef({ frame: 0 });
  const imagesRef = useRef([]);
  const frames = useMemo(buildFrameList, []);
  const ranges = useMemo(getSequenceRanges, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { alpha: false });
    const section = sectionRef.current;

    let currentRenderedFrame = -1;
    let lenisTicker;

    const drawImageCover = (img) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
      const x = (canvasWidth - img.width * scale) / 2;
      const y = (canvasHeight - img.height * scale) / 2;

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      // "low" bilinear resampling: on a full-viewport photo the quality
      // difference is imperceptible, but it's far cheaper per scrub frame.
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "low";
      context.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    const render = () => {
      const frameIndex = Math.round(frameRef.current.frame);

      if (frameIndex === currentRenderedFrame) return;

      const img = imagesRef.current[frameIndex];
      if (!img || !img.complete) return;

      currentRenderedFrame = frameIndex;
      drawImageCover(img);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      currentRenderedFrame = -1;
      render();
    };

    imagesRef.current = frames.map(() => null);

    const loadFrame = (index, priority = false) => {
      if (imagesRef.current[index]) return imagesRef.current[index];

      const img = new Image();
      img.decoding = "async";
      if (priority) img.fetchPriority = "high";
      img.src = frames[index];

      if (index === 0) {
        img.onload = () => {
          frameRef.current.frame = 0;
          resize();
        };
      }

      imagesRef.current[index] = img;
      return img;
    };

    const loadBatch = (start, end, priority = false) => {
      for (let index = start; index < Math.min(end, frames.length); index += 1) {
        loadFrame(index, priority);
      }
    };

    loadBatch(0, 18, true);

    const preloadRest = () => {
      let cursor = 18;
      const batch = () => {
        loadBatch(cursor, cursor + 12);
        cursor += 12;
        if (cursor < frames.length) {
          window.setTimeout(batch, 90);
        }
      };
      batch();
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(preloadRest, { timeout: 900 });
    } else {
      window.setTimeout(preloadRest, 700);
    }

    const lenis = new Lenis({
      // Smoother glide: longer settle + soft exponential ease-out.
      // Dial feel here — duration up = silkier/floatier, down = snappier;
      // wheelMultiplier down = gentler per notch.
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);

    lenisTicker = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(lenisTicker);
    gsap.ticker.lagSmoothing(0);

    resize();

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${TOTAL_FRAMES * 34}`,
          scrub: true,
          pin: true,
        },
      });

      timeline.to(
        frameRef.current,
        {
          frame: TOTAL_FRAMES - 1,
          ease: "none",
          snap: "frame",
          duration: 1,
          onUpdate: render,
        },
        0
      );

      // Hero content reveals on scroll (same effect as the original word
      // reveal): title words, subtitle, then CTAs stagger up out of blur.
      const revealItems = textRef.current
        ? textRef.current.querySelectorAll(
            ".hero-title span, .hero-subtitle, .hero-cta-row"
          )
        : [];

      gsap.set(revealItems, {
        yPercent: 120,
        opacity: 0,
        filter: "blur(10px)",
      });

      const revealStart = ranges[1].start / TOTAL_FRAMES;

      timeline.to(
        revealItems,
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.035,
          ease: "power3.out",
          duration: 0.16,
        },
        revealStart + 0.015
      );
    }, section);

    // Start anchored at the top so pinned triggers measure from a stable
    // position, then recompute once async layout (images/fonts) settles.
    // Without this the first scroll can jump by the pin-spacer amount.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    const refreshTimer = window.setTimeout(refresh, 1200);

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(lenisTicker);
      lenis.destroy();
      ctx.revert();
    };
  }, [frames, ranges]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero-sequence has-interactive-cursor"
      onMouseMove={(event) => {
        setCursorPosition({ x: event.clientX, y: event.clientY });
        setCursorVisible(true);
      }}
      onMouseEnter={() => setCursorVisible(true)}
      onMouseLeave={() => setCursorVisible(false)}
    >
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="hero-overlay" />

      <div
        className={`interactive-cursor ${cursorVisible ? "is-visible" : ""}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      >
        <span className="cursor-dot">
          <i />
        </span>
        <span className="cursor-label">Scroll to explore</span>
      </div>

      <div ref={textRef} className="hero-content">
        <h1 className="hero-title" aria-label="The unified operating system for modern carrier operations.">
          {"The unified operating system for modern carrier operations."
            .split(" ")
            .map((word, index) => (
              <span key={`${word}-${index}`} aria-hidden="true">
                {word}
              </span>
            ))}
        </h1>
        <p className="hero-subtitle">
          Loadhunt brings every part of running a trucking business into one
          workspace. Find loads. Book them. Dispatch your drivers. Track
          shipments. Invoice brokers. Get paid. All in one place — not five.
        </p>
        <div className="hero-cta-row">
          <a className="btn btn-primary btn-xl" href="#waitlist">Join waitlist</a>
          <a className="btn btn-secondary btn-xl" href="#products">
            Explore product <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

const PARTNERS = [
  { name: "DAT", src: "/partners/dat.svg" },
  { name: "Truckstop", src: "/partners/truckstop.svg" },
  { name: "Direct Freight", src: "/partners/direct-freight.svg" },
  { name: "Sylectus", src: "/partners/sylectus.svg" },
  { name: "Samsara", src: "/partners/samsara.svg" },
  { name: "Motive", src: "/partners/motive.svg" },
];

function PartnerStrip() {
  return (
    <section className="partner-strip" aria-label="Industry partners">
      <p className="partner-strip-label">Building with industry partners</p>
      <div className="partner-strip-row">
        {PARTNERS.map((partner) => (
          <span className="partner-logo-slot" key={partner.name}>
            <img className="partner-logo-img" src={partner.src} alt={partner.name} />
          </span>
        ))}
      </div>
    </section>
  );
}

function OneWorkspaceSection() {
  return (
    <section className="story-section">
      <div className="story-inner">
        <div className="story-copy">
          <h2 className="story-title">One workspace. The whole operation.</h2>
          <p>
            Today, an average US carrier runs their business across five
            disconnected platforms. DAT for loads. Truckstop for backup. Samsara
            for tracking. QuickBooks for invoices. An Excel sheet for everything
            in between.
          </p>
          <p>Every shipment touches all of them. None of them talk to each other.</p>
          <p>
            Loadhunt is the layer above. One workspace where the day flows from
            finding a load, to booking it, to assigning a driver, to tracking the
            truck, to sending the invoice, to seeing the deposit hit. Not five
            logins. One.
          </p>
        </div>

        <div className="story-visual-diagram" aria-hidden="true">
          <img
            className="story-diagram-img"
            src="/product-mockups/unify-diagram.png"
            alt="Five load sources unified into one feed"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

function LoadboardToOsSection() {
  const steps = [
    "Load discovery",
    "Booking",
    "Dispatch",
    "Tracking",
    "Invoicing",
    "Payment",
  ];

  return (
    <section className="story-section story-section-alt">
      <div className="story-inner story-inner-stack">
        <div className="story-copy story-copy-wide">
          <h2 className="story-title">From load board to operating system.</h2>
          <p>
            Most freight tech tries to make one piece better — a smarter load
            board, a faster ELD app, a cleaner accounting tool. Carriers end up
            with a stack of tools that each solve 10% of the problem.
          </p>
          <p>
            Loadhunt takes a different approach: we don't try to be the best at
            one thing. We're the workspace where every thing happens. Aggregating
            load boards is just the entry point. The platform extends into
            dispatch, fleet management, live tracking, accounting, and market
            intelligence — all on the same operational backbone.
          </p>
        </div>

        <div className="os-timeline" aria-hidden="true">
          {steps.map((step, index) => (
            <div className="os-step" key={step}>
              <span className="os-step-dot">{index + 1}</span>
              <span className="os-step-label">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="network" className="problem-section">
      <div className="problem-glow" />
      <div className="problem-grid" />

      <div className="problem-inner">
        <GlobeSection />
      </div>
    </section>
  );
}

function GlobeSection() {
  return (
    <div id="network" className="globe-block">
      <div className="globe-copy">
        <span className="section-index">Network</span>
        <h3>Built for freight teams operating across markets.</h3>
        <p>
          Loadhunt connects carriers, brokers, dispatchers, drivers, and financial operations into one live operational layer.
        </p>
      </div>
    </div>
  );
}

const PRODUCTS = [
  {
    name: "Marketplace",
    eyebrow: "Load marketplace",
    description:
      "Every load source — DAT, Truckstop, Direct Freight, broker-direct — in one normalized feed, scored by AI for your lanes.",
    link: "Explore Marketplace",
    href: "#waitlist",
    mockup: "marketplace",
  },
  {
    name: "TMS for Carriers",
    eyebrow: "Fleet operations",
    description:
      "Drivers, trucks, trailers, assignments. Your fleet operations inside the same workspace.",
    link: "Explore TMS",
    href: "#waitlist",
    mockup: "tms-carriers",
  },
  {
    name: "Live Tracking",
    eyebrow: "Visibility",
    description:
      "Fleet visibility powered by Samsara, Motive, and other ELD providers. See every truck, every shipment, every HOS clock.",
    link: "Explore Tracking",
    href: "#waitlist",
    mockup: "live-tracking",
  },
  {
    name: "Accounting",
    eyebrow: "Money flow",
    description:
      "Generate invoices from completed loads. Track broker payments. Connect factoring partners. Money flow where load flow lives.",
    link: "Explore Accounting",
    href: "#waitlist",
    mockup: "accounting",
  },
  {
    name: "TMS for Brokers",
    eyebrow: "For brokers",
    description:
      "Direct posting to a verified carrier network. Tracking visibility. Faster booking.",
    badge: "Coming soon",
    link: "Join broker waitlist",
    href: "#waitlist",
    mockup: "tms-brokers",
  },
];

const TRUST_METRICS = [
  {
    value: "1000+",
    label: "paid users",
    detail: "Real carriers running on Loadhunt in production.",
  },
  {
    value: "1.5+ yrs",
    label: "in production",
    detail: "A live product with active subscription revenue.",
  },
  {
    value: "10k",
    label: "growth target",
    detail: "Roadmap target for the connected Loadhunt ecosystem.",
  },
];

const AUDIENCES = [
  {
    title: "Carriers",
    body: "Control loads, drivers, documents, invoices, expenses, and payroll from one operating layer.",
    points: ["Fleet visibility", "Document flow", "Profit control"],
  },
  {
    title: "Dispatchers",
    body: "Move faster across loadboards, emails, calls, maps, broker context, and automation.",
    points: ["Multi-board search", "Broker context", "One-click booking"],
  },
  {
    title: "Brokers",
    body: "Coordinate communication, load data, and operational handoff with cleaner team visibility.",
    points: ["Shared context", "Faster replies", "Cleaner workflow"],
  },
];

function TrustMetricsSection() {
  return (
    <section id="trust" className="trust-metrics-section">
      <div className="trust-inner">
        <div className="trust-heading">
          <span className="section-index">Trust</span>
          <h2>Built on real usage, not a concept deck.</h2>
          <p>
            Real carriers already run loads, dispatch, and payments on Loadhunt — with a roadmap into the full operating system.
          </p>
        </div>

        <div className="trust-grid">
          {TRUST_METRICS.map((metric) => (
            <article key={metric.label} className="trust-card">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
              <p>{metric.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoForSection() {
  return (
    <section id="who" className="who-section">
      <div className="who-inner">
        <div className="who-heading">
          <span className="section-index">Who it's for</span>
          <h2>One ecosystem for the people moving freight.</h2>
        </div>

        <div className="audience-grid">
          {AUDIENCES.map((audience) => (
            <article key={audience.title} className="audience-card">
              <h3>{audience.title}</h3>
              <p>{audience.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductsSection() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const viewportRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || !viewportRef.current || window.innerWidth < 901) return undefined;

    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;

    const ctx = gsap.context(() => {
      const getScrollAmount = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      gsap.set(track, { x: 0 });

      gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollAmount() + window.innerWidth * 0.65}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="products" ref={sectionRef} className="products-section">
      <div className="products-shell">
        <div className="products-heading">
          <span className="section-index">Built modular</span>
          <div className="products-heading-copy">
            <h2>Built modular. Activate what you need.</h2>
            <p>
              Each module works standalone or together. Start with what's painful. Add what's next.
            </p>
          </div>
        </div>

        <div ref={viewportRef} className="products-carousel-viewport">
          <div ref={trackRef} className="products-track">
            {PRODUCTS.map((product, index) => (
              <ProductSlide key={product.name} product={product} index={index} total={PRODUCTS.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductSlide({ product, index, total }) {
  const cardRef = useRef(null);

  const handleMove = (event) => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 901) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * -14;
    const rotateY = ((x - rect.width / 2) / rect.width) * 14;

    card.style.setProperty("--tilt-rotate-x", `${rotateX}deg`);
    card.style.setProperty("--tilt-rotate-y", `${rotateY}deg`);
    card.style.setProperty("--tilt-glow-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--tilt-glow-y", `${(y / rect.height) * 100}%`);
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--tilt-rotate-x", "0deg");
    card.style.setProperty("--tilt-rotate-y", "0deg");
    card.style.setProperty("--tilt-glow-x", "50%");
    card.style.setProperty("--tilt-glow-y", "50%");
  };

  return (
    <article
      ref={cardRef}
      className="product-slide"
      onMouseEnter={handleMove}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="product-slide-content">
        <div>
          <h3>
            {product.name}
            {product.badge && <em className="product-badge">{product.badge}</em>}
          </h3>
          <p>{product.description}</p>
        </div>

        <div className="product-slide-footer">
          <a className="product-link" href={product.href}>
            {product.link} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>

      <div className="product-slide-visual">
        <img
          className="product-mockup-image"
          src={`/product-mockups/${product.mockup}.png`}
          alt={`${product.name} product interface mockup`}
          loading="lazy"
        />
      </div>
    </article>
  );
}

function VideoStatementSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return undefined;

    // Only play while on screen so an off-screen clip doesn't decode and
    // contend with the main thread. Wide rootMargin gives it a head start to
    // buffer before it's fully in view, so arriving on the section is smooth.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "400px 0px" }
    );

    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="video-statement-section">
      <video
        ref={videoRef}
        className="video-statement-media"
        src="/videos/cardboard-boxes.mp4"
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
      />
      <div className="video-statement-overlay" />
      <div className="video-statement-content">
        <h2>Dispatch smarter, not harder.</h2>
      </div>
    </section>
  );
}

function GeometryPhysicsSection() {
  const sectionRef = useRef(null);
  const shapeRefs = useRef([]);

  const shapes = useMemo(
    () => [
      { className: "shape-blob shape-blob-left", w: 520, h: 520, x: 0.02, y: 0.16, drift: 90, rotate: -8 },
      { className: "shape-pill shape-pill-main", w: 470, h: 190, x: 0.3, y: 0.43, drift: 72, rotate: -32 },
      { className: "shape-blob shape-blob-main", w: 520, h: 520, x: 0.51, y: 0.66, drift: 80, rotate: 10 },
      { className: "shape-poly shape-poly-right", w: 440, h: 420, x: 0.82, y: 0.38, drift: 65, rotate: 16 },
      { className: "shape-blob shape-blob-small", w: 300, h: 300, x: 0.78, y: 0.72, drift: 54, rotate: -6 },
      { className: "shape-card shape-card-arrow", w: 300, h: 190, x: 0.26, y: 0.84, drift: 48, rotate: 0 },
    ],
    []
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;

    const ctx = gsap.context(() => {
      // Cache layout reads — recomputed on resize, not every frame (avoids reflow thrash).
      let viewportWidth = window.innerWidth;
      let sectionHeight = section.offsetHeight || 1120;

      const measure = () => {
        viewportWidth = window.innerWidth;
        sectionHeight = section.offsetHeight || 1120;
      };

      const updatePositions = (progress = 0) => {
        const now = performance.now();

        // ≥1920px: keep content width fixed and stop the decorative field from
        // spreading to the screen edges — freeze it to a 1920-wide canvas,
        // centered, so the shapes stay anchored to the (centered) content.
        const fieldWidth = Math.min(viewportWidth, 1920);
        const fieldOffsetX = (viewportWidth - fieldWidth) / 2;

        shapes.forEach((shape, index) => {
          const element = shapeRefs.current[index];
          if (!element) return;

          const phase = index * 0.72;
          const baseX = fieldOffsetX + fieldWidth * shape.x;
          const baseY = sectionHeight * shape.y;
          const scrollX = Math.sin(progress * Math.PI * 2 + phase) * shape.drift;
          const scrollY = Math.cos(progress * Math.PI * 1.7 + phase) * (shape.drift * 0.58);
          const floatX = Math.sin(now * 0.00055 + phase) * 16;
          const floatY = Math.cos(now * 0.00048 + phase) * 12;
          const rotate = shape.rotate + Math.sin(progress * Math.PI * 1.8 + phase) * 7;

          element.style.transform = `translate3d(${baseX + scrollX + floatX}px, ${baseY + scrollY + floatY}px, 0) translate(-50%, -50%) rotate(${rotate}deg)`;
        });
      };

      let latestProgress = 0;
      let animationFrame = 0;
      let running = false;

      const tick = () => {
        updatePositions(latestProgress);
        animationFrame = window.requestAnimationFrame(tick);
      };

      const start = () => {
        if (running) return;
        running = true;
        tick();
      };

      const stop = () => {
        running = false;
        window.cancelAnimationFrame(animationFrame);
      };

      // Only run the animation loop while the section is on (or near) screen.
      // Off-screen it would otherwise burn the main thread and jank the whole page.
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) start();
          else stop();
        },
        { rootMargin: "200px 0px" }
      );
      io.observe(section);

      gsap.to(section, {
        "--geometry-scroll": 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            latestProgress = self.progress;
          },
        },
      });

      const onResize = () => {
        measure();
        updatePositions(latestProgress);
      };
      window.addEventListener("resize", onResize);

      return () => {
        stop();
        io.disconnect();
        window.removeEventListener("resize", onResize);
      };
    }, section);

    return () => ctx.revert();
  }, [shapes]);

  return (
    <section id="motion" ref={sectionRef} className="geometry-physics-section">
      <div className="geometry-copy geometry-manifesto">
        <span className="section-index">Roadmap</span>
        <h2>Where we're going.</h2>
        <p>
          Today, Loadhunt is a workspace for carriers. A better way to find
          loads. A simpler way to run dispatch.
        </p>
        <p>
          Within three years, the data flowing through the platform becomes the
          most accurate freight market intelligence in the industry. Real-time.
          Lane-specific. Broker-specific. Not survey-driven. Sold as a standalone
          product to participants who never even use our platform.
        </p>
        <p>
          Within five years, it's a unified network. Carriers, brokers, factoring
          providers, ELD vendors, insurance — all working from the same
          operational substrate. Transparent. Accountable.
        </p>
        <p>
          We don't think of Loadhunt as a SaaS product. We think of it as
          infrastructure for an industry that's overdue for it.
        </p>

        <div className="manifesto-timeline">
          {[
            {
              year: "Year 1",
              label: "Marketplace MVP",
              detail:
                "A workspace for carriers — find loads, book them, run dispatch.",
            },
            {
              year: "Year 3",
              label: "Market intelligence",
              detail:
                "Real-time, lane- and broker-specific freight data — sold standalone.",
            },
            {
              year: "Year 5",
              label: "Unified network",
              detail:
                "Carriers, brokers, factoring, ELD and insurance on one substrate.",
            },
            {
              year: "Year 10",
              label: "Industry infrastructure",
              detail:
                "The operational backbone an overdue industry finally runs on.",
            },
          ].map((step) => (
            <div className="manifesto-step" key={step.year}>
              <span className="manifesto-year">{step.year}</span>
              <span className="manifesto-label">{step.label}</span>
              <span className="manifesto-detail">{step.detail}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="geometry-stage" aria-label="Interactive floating geometry">
        <div className="geometry-line geometry-line-one" />
        <div className="geometry-line geometry-line-two" />
        <div className="geometry-line geometry-line-three" />

        {shapes.map((shape, index) => (
          <div
            key={`${shape.className}-${index}`}
            ref={(node) => {
              shapeRefs.current[index] = node;
            }}
            className={`geometry-shape ${shape.className}`}
            style={{ width: shape.w, height: shape.h }}
          >
            {shape.className.includes("shape-poly-right") && <span className="shape-outline-triangle" />}
          </div>
        ))}
      </div>
    </section>
  );
}

function AiSection() {
  return (
    <section className="story-section ai-section">
      <div className="story-inner">
        <div className="story-copy">
          <h2 className="story-title">AI that learns your operation.</h2>
          <p>
            Every load you save, every broker you work with, every lane you
            favor — Loadhunt's AI learns from it. The result is a workspace that
            gets smarter the longer you use it.
          </p>
          <p>
            The Marketplace doesn't show you every load. It shows you the ones
            that match — by RPM, by lane, by broker reliability, by equipment
            fit. Your dispatcher stops scrolling. They start picking.
          </p>
          <p>
            Over time, the same data becomes something bigger: a real-time map of
            the freight market. Where rates are heading. Which brokers actually
            pay. Which lanes are heating up. Built from operations, not from
            surveys.
          </p>
        </div>

        <div className="ai-visual-img" aria-hidden="true">
          <img
            className="ai-visual-svg"
            src="/ai-score.svg"
            alt="AI load score with rationale"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

const INTEGRATION_GROUPS = [
  {
    label: "Load boards we aggregate",
    items: [
      { name: "DAT", src: "/partners/dat.svg" },
      { name: "Truckstop", src: "/partners/truckstop.svg" },
      { name: "Direct Freight", src: "/partners/direct-freight.svg" },
      { name: "Sylectus", src: "/partners/sylectus.svg" },
    ],
  },
  {
    label: "ELD providers we connect",
    items: [
      { name: "Samsara", src: "/partners/samsara.svg" },
      { name: "Motive", src: "/partners/motive.svg" },
      { name: "Geotab", src: "/partners/geotab.svg" },
    ],
  },
  {
    label: "Coming with Accounting (Phase 5)",
    items: [
      { name: "TBS Factoring" },
      { name: "OTR Capital" },
      { name: "Apex Capital" },
      { name: "Triumph Pay" },
    ],
  },
  { label: "Compliance", items: [{ name: "FMCSA verified at registration" }] },
];

function IntegrationsSection() {
  return (
    <section className="integrations-section">
      <div className="integrations-inner">
        <div className="integrations-head">
          <h2 className="story-title">Built with the industry.</h2>
          <p>
            We work with the platforms carriers already trust — and verify
            everyone through FMCSA.
          </p>
        </div>

        <div className="integration-groups">
          {INTEGRATION_GROUPS.map((group) => (
            <div className="integration-group" key={group.label}>
              <span className="integration-group-label">{group.label}</span>
              <div className="integration-logos">
                {group.items.map((item) =>
                  item.src ? (
                    <img
                      className="integration-logo-img"
                      src={item.src}
                      alt={item.name}
                      key={item.name}
                      loading="lazy"
                    />
                  ) : (
                    <span className="integration-logo" key={item.name}>
                      {item.name}
                    </span>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="integrations-note">
          Partnership status varies. Some integrations are live. Others are in
          roadmap.
        </p>
      </div>
    </section>
  );
}

function FinalCTASection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="waitlist-section">
      <div className="waitlist-inner">
        <div className="waitlist-head">
          <h2>Be early.</h2>
          <p>
            Loadhunt rolls out by segment. Tell us who you are — we'll keep you
            posted on access.
          </p>
        </div>

        {submitted ? (
          <div className="waitlist-success">
            <h3>You're on the list.</h3>
            <p>
              We'll reach out when there's something meaningful to share — not
              just to fill a cadence.
            </p>
          </div>
        ) : (
          <form className="waitlist-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Email *</span>
              <input
                className="field-input"
                type="email"
                required
                placeholder="you@company.com"
              />
            </label>

            <label className="field">
              <span className="field-label">Company name *</span>
              <input
                className="field-input"
                type="text"
                required
                placeholder="Acme Logistics"
              />
            </label>

            <label className="field field-full">
              <span className="field-label">I'm a... *</span>
              <select className="field-input" required defaultValue="">
                <option value="" disabled>
                  Select role
                </option>
                <option>Carrier (owner / dispatcher)</option>
                <option>Broker</option>
                <option>Loadboard / ELD partner</option>
                <option>Factoring partner</option>
                <option>Investor / press</option>
                <option>Other</option>
              </select>
            </label>

            <label className="field field-full">
              <span className="field-label">
                Brief context <em>(optional)</em>
              </span>
              <textarea
                className="field-input"
                rows="3"
                placeholder="Anything we should know?"
              />
            </label>

            <div className="field-full waitlist-submit">
              <button className="btn btn-primary btn-xl" type="submit">
                Join waitlist
              </button>
              <p className="waitlist-micro">
                We respond within 24 hours. We won't share your information or
                spam you.
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="site-footer-v2">
      <div className="footer-top">
        <a className="navbar-brand footer-logo" href="#top" aria-label="huntOS home">
          <img className="navbar-logo-img" src="/huntos-icon.svg" alt="" aria-hidden="true" />
          <b>huntOS</b>
        </a>

        <div className="footer-cols">
          <div className="footer-col">
            <span className="footer-col-title">Product</span>
            <a href="#products">Marketplace</a>
            <a href="#products">TMS for Carriers</a>
            <a href="#products">TMS for Brokers</a>
            <a href="#products">Live Tracking</a>
            <a href="#products">Accounting</a>
            <a href="#products">$LHUNT</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Solutions</span>
            <a href="#solutions">For Carriers</a>
            <a href="#solutions">For Brokers</a>
            <a href="#solutions">For Partners</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Company</span>
            <a href="#contact">About us</a>
            <a href="#contact">Careers</a>
            <a href="#articles">Articles</a>
          </div>
          <div className="footer-col">
            <span className="footer-col-title">Terms &amp; Policies</span>
            <a href="#">Terms of service</a>
            <a href="#">Privacy policy</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">© 2026 huntOS.</span>
      </div>
    </footer>
  );
}


const MarketplacePage   = lazy(() => import("./pages/marketplace/page.tsx"));
const TmsCarriersPage   = lazy(() => import("./pages/tms-for-carriers/page.tsx"));
const TmsBrokersPage    = lazy(() => import("./pages/tms-for-brokers/page.tsx"));
const LiveTrackingPage  = lazy(() => import("./pages/live-trucking/page.tsx"));
const AccountingPage    = lazy(() => import("./pages/accounting/page.tsx"));

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/marketplace"       element={<Suspense fallback={null}><ProductLayout><MarketplacePage /></ProductLayout></Suspense>} />
      <Route path="/tms-for-carriers"  element={<Suspense fallback={null}><ProductLayout><TmsCarriersPage /></ProductLayout></Suspense>} />
      <Route path="/tms-for-brokers"   element={<Suspense fallback={null}><ProductLayout><TmsBrokersPage /></ProductLayout></Suspense>} />
      <Route path="/live-trucking"     element={<Suspense fallback={null}><ProductLayout><LiveTrackingPage /></ProductLayout></Suspense>} />
      <Route path="/accounting"        element={<Suspense fallback={null}><ProductLayout><AccountingPage /></ProductLayout></Suspense>} />
    </Routes>
  );
}

function LandingPage() {
  useEffect(() => {
    // Keep body dark while landing page is mounted (counters any product-page CSS that may have loaded).
    document.body.style.setProperty("background", "#000");
    document.body.style.setProperty("color", "#fff");
    return () => {
      document.body.style.removeProperty("background");
      document.body.style.removeProperty("color");
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textItems = gsap.utils.toArray(
        "main section:not(.hero-sequence):not(.letter-bridge-section) h2, main section:not(.hero-sequence):not(.letter-bridge-section) h3, main section:not(.hero-sequence):not(.letter-bridge-section) p, main section:not(.hero-sequence):not(.letter-bridge-section) li, main section:not(.hero-sequence):not(.letter-bridge-section) .section-index, main section:not(.hero-sequence):not(.letter-bridge-section) .product-number, main footer h2, main footer p, main footer a"
      );

      textItems.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 32,
            transformOrigin: "50% 100%",
          },
          {
            // Only opacity + transform here — these are GPU-composited and
            // cheap. The previous blur()/clipPath animation repainted every
            // frame on every text node and was the main cause of scroll jank.
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: Math.min((index % 4) * 0.035, 0.12),
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              // play once and stop reacting to scroll — no repeated
              // forward/reverse work as the user scrolls back and forth.
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />
      <main>
        <HeroSequence />
        <PartnerStrip />
        <OneWorkspaceSection />
        <LoadboardToOsSection />
        <ProblemSection />
        <TrustMetricsSection />
        <WhoForSection />
        <ProductsSection />
        <AiSection />
        <IntegrationsSection />
        <VideoStatementSection />
        <GeometryPhysicsSection />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  );
}
