import React, { useEffect, useMemo, useRef, useState } from "react";
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

const CENTER_TEXT = "New era of trucking starts here";
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
    { name: "Marketplace", description: "Every load source, one feed" },
    { name: "TMS for Carriers", description: "Drivers, trucks, dispatch" },
    { name: "TMS for Brokers", description: "Direct posting & matching", status: "Coming soon" },
    { name: "Live Tracking", description: "ELD-powered fleet visibility" },
    { name: "Accounting", description: "Invoices, settlements, factoring" },
    { name: "$LHUNT", description: "The token aligning the network" },
  ];

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-inner">
        <a className="navbar-brand" href="#top" aria-label="huntOS home">
          <span className="navbar-logo" aria-hidden="true">
            <svg viewBox="0 0 28 28">
              <rect width="28" height="28" rx="7" fill="#171717" />
              <path
                d="M14 4.4 L15.7 12.3 L23.6 14 L15.7 15.7 L14 23.6 L12.3 15.7 L4.4 14 L12.3 12.3 Z"
                fill="#fff"
              />
              <circle cx="14" cy="14" r="1.7" fill="#171717" />
              <circle cx="20.4" cy="7.6" r="0.9" fill="#fff" />
              <circle cx="20.4" cy="20.4" r="0.9" fill="#fff" />
              <circle cx="7.6" cy="20.4" r="0.9" fill="#fff" />
              <circle cx="7.6" cy="7.6" r="0.9" fill="#fff" />
            </svg>
          </span>
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
                  <a className="navbar-panel-link" href="#products" key={product.name}>
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
        <h1 className="hero-title">
          The unified operating system for modern carrier operations.
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

function ProblemColumn({ label, title, bullets, footer }) {
  return (
    <article className="problem-column">
      <span>{label}</span>
      <h3>{title}</h3>
      <ul>
        {bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>{footer}</p>
    </article>
  );
}

function GlobeSection() {
  return (
    <div id="network" className="globe-block">
      <div className="globe-copy">
        <span className="section-index">02 / Network</span>
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
    name: "loadhunter",
    eyebrow: "AI Browser Extension",
    title: "Find and evaluate loads faster on major loadboards",
    description:
      "LoadHunter Extension enhances the load booking process on DAT, Truckstop, and other major loadboards with automation, broker context, and faster decision making.",
    mockup: "dashboard",
  },
  {
    name: "huntTMS",
    eyebrow: "Transport Management",
    title: "A connected operating system for dispatch teams",
    description:
      "Comprehensive transport management system providing a single platform to manage loads, dispatchers, drivers, documents, and operational workflows.",
    mockup: "calendar",
  },
  {
    name: "huntPAY",
    eyebrow: "Payments & Finance",
    title: "Payments, invoices, expenses, and tolls in one workflow",
    description:
      "Financial operations connected to the same trucking workflow: invoices, driver expenses, tolls, payment status, and reporting.",
    badge: "Coming soon",
    mockup: "payments",
  },
  {
    name: "huntDRIVE",
    eyebrow: "Driver Workflow",
    title: "Driver context, route visibility, and HOS-aware operations",
    description:
      "Driver workflow, route visibility, hours-of-service context, documents, communication, and operational tools in one place.",
    badge: "Coming soon",
    mockup: "drive",
  },
  {
    name: "fleetHUNT",
    eyebrow: "Fleet Intelligence",
    title: "Optimize routes, brokers, and dispatch decisions",
    description:
      "Fleet optimization, route planning, broker evaluation, and AI-assisted dispatch decisions for faster and cleaner operations.",
    badge: "Coming soon",
    mockup: "map",
  },
  {
    name: "huntONE",
    eyebrow: "Unified Search",
    title: "One search layer for freight opportunities and workflows",
    description:
      "Unified search and operational intelligence layer for freight opportunities, internal workflows, and team-wide visibility.",
    badge: "Coming soon",
    mockup: "search",
  },
];

const TRUST_METRICS = [
  {
    value: "1000+",
    label: "paid users",
    detail: "Real customers using LoadHunter in production.",
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
    points: ["AutoEmail", "Telegram loads", "One-click actions"],
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
          <span className="section-index">03 / Trust</span>
          <h2>Built on real usage, not a concept deck.</h2>
          <p>
            LoadHunter already combines extension, dashboard, automation, and a roadmap toward a connected TMS and LoadBoard.
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
          <span className="section-index">04 / Who it is for</span>
          <h2>One ecosystem for the people moving freight.</h2>
        </div>

        <div className="audience-grid">
          {AUDIENCES.map((audience, index) => (
            <article key={audience.title} className="audience-card">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{audience.title}</h3>
              <p>{audience.body}</p>
              <ul>
                {audience.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
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
          <span className="section-index">05 / Products</span>
          <div className="products-heading-copy">
            <h2>Our ecosystem products</h2>
            <p>
              Everything you need to find, evaluate, book, manage, and pay for loads — faster, smarter, and in one place.
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
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="product-slide-content">
        <div>
          <span className="product-eyebrow">
            <i /> {product.eyebrow}
          </span>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
        </div>

        <div className="product-slide-footer">
          <span className="product-brand-pill">
            <i>✦</i>
            {product.name}
          </span>

          <div className="product-progress">
            <strong>{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</strong>
            <div className="product-progress-bars">
              {Array.from({ length: total }).map((_, progressIndex) => (
                <span key={progressIndex} className={progressIndex === index ? "is-active" : ""} />
              ))}
            </div>
          </div>
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

        shapes.forEach((shape, index) => {
          const element = shapeRefs.current[index];
          if (!element) return;

          const phase = index * 0.72;
          const baseX = viewportWidth * shape.x;
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
      <div className="geometry-copy">
        <span className="section-index">06 / Motion system</span>
        <h2>Freight operations should feel responsive, alive, and connected.</h2>
        <p>
          Floating geometry reacts softly to scroll, creating a tactile motion moment after the dispatch story.
        </p>
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

function RippleBackground() {
  return (
    <div className="ripple-background" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, index) => (
        <span key={index} style={{ "--ripple-index": index }} />
      ))}
    </div>
  );
}

function FinalCTASection() {
  return (
    <section id="waitlist" className="final-cta-section">
      <div className="final-cta-inner">
        <span className="section-index">07 / Start</span>
        <h2>Book a demo or join early access.</h2>
        <p>
          Start with the extension workflow today and stay close to the Loadhunt TMS, payments, driver, and ecosystem roadmap.
        </p>

        <div className="final-cta-actions">
          <a href="https://www.loadhunter.io/demo" target="_blank" rel="noreferrer">
            Book demo
          </a>
          <a href="mailto:hello@loadhunt.com?subject=Join%20Loadhunt%20early%20access">
            Join early access
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <RippleBackground />

      <div className="footer-inner">
        <div>
          <span className="section-index">08 / Contact</span>
          <h2>Move freight with one connected operating layer.</h2>
        </div>

        <div className="footer-links">
          <a href="#top">Back to top</a>
          <a href="#products">Products</a>
          <a href="mailto:hello@loadhunt.com">hello@loadhunt.com</a>
        </div>

        <p>© 2026 Loadhunt. Built for modern freight teams.</p>
      </div>
    </footer>
  );
}


export default function App() {
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
        <ProblemSection />
        <TrustMetricsSection />
        <WhoForSection />
        <ProductsSection />
        <VideoStatementSection />
        <GeometryPhysicsSection />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  );
}
