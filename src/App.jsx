import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

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
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const isScrollingDown = currentY > lastY && currentY > 70;

      setScrolled(isScrollingDown);
      lastY = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const productLinks = [
    {
      name: "loadhunter",
      label: "AI Browser Extension",
      description: "Automation, broker context, maps, RPM, and faster loadboard actions.",
      status: "Live",
    },
    {
      name: "huntTMS",
      label: "Carrier TMS",
      description: "Loads, drivers, documents, invoices, expenses, payroll, and reports.",
      status: "MVP",
    },
    {
      name: "huntPAY",
      label: "Payments",
      description: "Invoices, driver settlements, tolls, fuel expenses, and payment workflow.",
      status: "Soon",
    },
    {
      name: "huntDRIVE",
      label: "Driver App",
      description: "Driver-side route, documents, HOS context, and mobile workflow layer.",
      status: "Soon",
    },
  ];

  const resourceLinks = [
    {
      title: "Who it is for",
      href: "#who",
      description: "Carriers, dispatchers, and brokers.",
    },
    {
      title: "Trust metrics",
      href: "#trust",
      description: "Usage, production timeline, and growth context.",
    },
    {
      title: "Motion system",
      href: "#motion",
      description: "A visual layer showing responsive freight operations.",
    },
    {
      title: "Contact",
      href: "#contact",
      description: "Book a demo or join early access.",
    },
  ];

  return (
    <header className={`site-header dark-shadow-nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-shell">
        <a className="brand-mark" href="#top" aria-label="Loadhunt home">
          <img src="/loadhunt-nav-logo.svg" alt="Loadhunt" />
        </a>

        <nav className="site-nav" aria-label="Main navigation">
          <a href="#problem">Problem</a>

          <div className="nav-dropdown-wrap">
            <a href="#products" className="nav-dropdown-trigger">
              Products
              <span>⌄</span>
            </a>

            <div className="nav-mega-panel nav-mega-products">
              <div className="mega-feature-card">
                <span>Products</span>
                <h3>Connected freight tools for the whole workflow.</h3>
                <p>One ecosystem from load search and dispatch actions to TMS, driver workflow, and payments.</p>
              </div>

              <div className="mega-grid">
                {productLinks.map((product) => (
                  <a href="#products" key={product.name} className="mega-product-link">
                    <span>
                      <b>{product.name}</b>
                      <small>{product.label}</small>
                    </span>
                    <em>{product.status}</em>
                    <p>{product.description}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="nav-dropdown-wrap">
            <a href="#trust" className="nav-dropdown-trigger">
              Resources
              <span>⌄</span>
            </a>

            <div className="nav-mega-panel nav-mega-resources">
              <div className="mega-feature-card">
                <span>Resources</span>
                <h3>Explore the operating layer.</h3>
                <p>Jump into proof, audience, product, motion, and contact sections without losing context.</p>
              </div>

              <div className="mega-resource-grid">
                {resourceLinks.map((resource) => (
                  <a href={resource.href} key={resource.title} className="mega-resource-link">
                    <b>{resource.title}</b>
                    <p>{resource.description}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <a href="#products">Pricing</a>
          <a href="#contact">Enterprise</a>
        </nav>

        <div className="nav-actions">
          <a className="header-secondary" href="#contact">Sign in</a>
          <a className="header-cta" href="#products">Get started</a>
        </div>

        <button
          className={`mobile-menu-button ${mobileOpen ? "is-open" : ""}`}
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`mobile-nav-panel ${mobileOpen ? "is-open" : ""}`}>
        <a href="#problem" onClick={() => setMobileOpen(false)}>Problem</a>
        <a href="#trust" onClick={() => setMobileOpen(false)}>Resources</a>
        <a href="#products" onClick={() => setMobileOpen(false)}>Products</a>
        <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
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
    const letters = textRef.current?.querySelectorAll("span") || [];

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
      duration: 1.08,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.15,
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
          anticipatePin: 1,
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

      gsap.set(letters, {
        yPercent: 120,
        opacity: 0,
        filter: "blur(10px)",
      });

      gsap.set(textRef.current, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      });

      const package2Start = ranges[1].start / TOTAL_FRAMES;

      timeline.to(
        letters,
        {
          yPercent: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.035,
          ease: "power3.out",
          duration: 0.16,
        },
        package2Start + 0.015
      );


    }, section);

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
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

      <h2 ref={textRef} className="center-reveal-text" aria-label={CENTER_TEXT}>
        {["New", "era", "of", "trucking"].map((word, index) => (
          <span key={`${word}-${index}`}>{word}</span>
        ))}
        <span className="center-reveal-break" aria-hidden="true" />
        {["starts", "here"].map((word, index) => (
          <span key={`starts-line-${word}-${index}`}>{word}</span>
        ))}
      </h2>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problem" className="problem-section">
      <div className="problem-glow" />
      <div className="problem-grid" />

      <div className="problem-inner">
        <div className="problem-header">
          <span className="section-index">01 / Problem</span>
          <div>
            <h2>What we solve</h2>
            <p className="problem-subtitle">
              Trucking operations are still fragmented across tools that were never designed to work together
            </p>
          </div>
        </div>

        <div className="problem-layout">
          <ProblemColumn
            label="Current reality"
            title="Teams lose time because every step lives in a different system."
            bullets={[
              "Dispatchers move between TMS, ELD dashboards, calls, and email;",
              "Drivers switch apps for logs, navigation, documents, and payments;",
              "Managers deal with scattered data and outdated reports;",
              "Accounting waits for missing documents and confirmations.",
            ]}
            footer="This creates delays, bad rates, compliance gaps, and lost revenue."
          />

          <ProblemColumn
            label="Loadhunt approach"
            title="We connect the workflow into one operational ecosystem."
            bullets={[
              "Shared data across the team;",
              "Unified workflow from search to payment;",
              "Automated steps where possible;",
              "Real-time visibility for the whole operation.",
            ]}
            footer="Less time jumping between systems. More time moving freight."
          />
        </div>

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

      <div className="globe-stage" aria-hidden="true">
        <div className="globe-fade">
          <RotatingAmGlobe />
        </div>
      </div>
    </div>
  );
}

function RotatingAmGlobe() {
  const globeRef = useRef(null);

  useEffect(() => {
    if (!globeRef.current) return;

    const root = am5.Root.new(globeRef.current);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        wheelY: "none",
        pinchZoom: false,
        projection: am5map.geoOrthographic(),
        rotationX: -102,
        rotationY: -24,
        homeZoomLevel: 1,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
      })
    );

    const backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {})
    );

    backgroundSeries.mapPolygons.template.setAll({
      fill: am5.color(0x020204),
      fillOpacity: 0.72,
      strokeOpacity: 0,
    });

    backgroundSeries.data.push({
      geometry: {
        type: "Sphere",
      },
    });

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      fill: am5.color(0xffffff),
      fillOpacity: 0.92,
      strokeOpacity: 0,
      interactive: false,
    });

    const shadowSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"],
      })
    );

    shadowSeries.mapPolygons.template.setAll({
      fill: am5.color(0xffffff),
      fillOpacity: 0.06,
      strokeOpacity: 0,
      interactive: false,
    });

    chart.appear(900, 120);

    chart.animate({
      key: "rotationX",
      from: -102,
      to: 258,
      duration: 36000,
      loops: Infinity,
      easing: am5.ease.linear,
    });

    return () => {
      root.dispose();
    };
  }, []);

  return <div ref={globeRef} className="amchart-globe" />;
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

function SectionLetterBridge({ label, eyebrow }) {
  const bridgeRef = useRef(null);

  useEffect(() => {
    const bridge = bridgeRef.current;
    if (!bridge) return undefined;

    const letters = gsap.utils.toArray(".bridge-letter", bridge);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        {
          yPercent: 110,
          rotateX: 48,
          opacity: 0,
          filter: "blur(14px)",
        },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.035,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bridge,
            start: "top 80%",
            end: "bottom 25%",
            scrub: 1,
          },
        }
      );

      gsap.to(bridge, {
        "--bridge-progress": 1,
        ease: "none",
        scrollTrigger: {
          trigger: bridge,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, bridge);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={bridgeRef} className="letter-bridge-section" aria-label={`${label} transition`}>
      <span className="section-index">{eyebrow}</span>
      <div className="letter-bridge-word" aria-label={label}>
        {label.split("").map((letter, index) => (
          <span key={`${letter}-${index}`} className="bridge-letter">
            {letter}
          </span>
        ))}
      </div>
    </section>
  );
}

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
          anticipatePin: 1,
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

function UntitledMockup({ type }) {
  const stroke = "#DAD7D4";
  const line = "#E8E5E3";
  const soft = "#F7F6F5";
  const card = "#FFFFFF";
  const accent = "#8B5CF6";
  const accentSoft = "#EDE9FE";
  const text = "#1F2937";
  const muted = "#6B7280";

  if (type === "dashboard") {
    return (
      <svg viewBox="0 0 760 560" className="untitled-svg" aria-hidden="true">
        <defs>
          <filter id="shadowA" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#111827" floodOpacity="0.08" />
          </filter>
          <linearGradient id="gradA" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FBFBFA" />
          </linearGradient>
        </defs>
        <rect x="160" y="68" width="560" height="410" rx="28" fill="url(#gradA)" stroke={stroke} />
        <circle cx="188" cy="98" r="7" fill="#D6D3D1" />
        <circle cx="210" cy="98" r="7" fill="#D6D3D1" />
        <circle cx="232" cy="98" r="7" fill="#D6D3D1" />
        <rect x="160" y="126" width="560" height="1" fill={line} />
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i}>
            <rect x="192" y={160 + i * 40} width="88" height="10" rx="5" fill="#E5E7EB" />
            <rect x="322" y={160 + i * 40} width="68" height="10" rx="5" fill="#E5E7EB" />
            <rect x="446" y={160 + i * 40} width="54" height="10" rx="5" fill="#E5E7EB" />
            <rect x="552" y={160 + i * 40} width="72" height="10" rx="5" fill="#E5E7EB" />
            <rect x="664" y={156 + i * 40} width="32" height="18" rx="9" fill={i % 2 === 0 ? '#F3F0FF' : '#F5F3FF'} />
          </g>
        ))}
        <g filter="url(#shadowA)">
          <rect x="48" y="176" width="184" height="118" rx="20" fill={card} stroke={stroke} />
          <text x="74" y="216" fontSize="22" fontWeight="600" fill={text}>AI Score</text>
          <text x="74" y="262" fontSize="48" fontWeight="700" fill={accent}>94</text>
          <text x="132" y="262" fontSize="24" fill={muted}>/100</text>
          <circle cx="196" cy="238" r="24" fill="none" stroke={accentSoft} strokeWidth="10" />
          <path d="M196 214 A24 24 0 1 1 176 250" fill="none" stroke={accent} strokeWidth="10" strokeLinecap="round" />
        </g>
        <g filter="url(#shadowA)">
          <rect x="56" y="374" width="230" height="96" rx="20" fill={card} stroke={stroke} />
          <text x="80" y="414" fontSize="18" fontWeight="600" fill={text}>Recommended</text>
          <text x="80" y="450" fontSize="30" fontWeight="700" fill={accent}>Book now</text>
          <rect x="206" y="398" width="44" height="44" rx="12" fill={accent} />
          <path d="M228 410v20M218 420h20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        </g>
        <g filter="url(#shadowA)">
          <rect x="538" y="392" width="190" height="118" rx="20" fill={card} stroke={stroke} />
          <text x="562" y="428" fontSize="18" fontWeight="600" fill={text}>Rate Insight</text>
          <text x="562" y="462" fontSize="30" fontWeight="700" fill={accent}>Above market</text>
          <path d="M564 486 C592 508, 612 464, 638 490 S684 446, 710 470" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (type === 'calendar') {
    return (
      <svg viewBox="0 0 760 560" className="untitled-svg" aria-hidden="true">
        <defs><filter id="shadowB" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#111827" floodOpacity="0.08" /></filter></defs>
        <g filter="url(#shadowB)">
          <rect x="92" y="84" width="576" height="392" rx="28" fill={card} stroke={stroke} />
        </g>
        <rect x="92" y="144" width="576" height="1" fill={line} />
        {['Mon','Tue','Wed','Thu','Fri'].map((d,i)=><text key={d} x={126+i*106} y={124} fontSize="16" fontWeight="600" fill={muted}>{d}</text>)}
        {Array.from({ length: 5 }).map((_, c) => (
          <line key={c} x1={208 + c * 106} y1="145" x2={208 + c * 106} y2="452" stroke={line} />
        ))}
        {Array.from({ length: 4 }).map((_, r) => (
          <line key={r} x1="92" y1={220 + r * 58} x2="668" y2={220 + r * 58} stroke={line} />
        ))}
        <rect x="118" y="168" width="78" height="34" rx="16" fill={accentSoft} />
        <text x="138" y="191" fontSize="16" fontWeight="700" fill={accent}>Loads</text>
        <rect x="232" y="232" width="154" height="72" rx="18" fill="#F5F3FF" />
        <text x="254" y="260" fontSize="16" fontWeight="700" fill={text}>Team sync</text>
        <text x="254" y="286" fontSize="14" fill={muted}>8:00 AM • Dispatch</text>
        <rect x="430" y="182" width="156" height="88" rx="18" fill="#F9FAFB" stroke={stroke} />
        <text x="452" y="212" fontSize="16" fontWeight="700" fill={text}>Active loads</text>
        <text x="452" y="246" fontSize="42" fontWeight="700" fill={accent}>48</text>
        <rect x="454" y="304" width="132" height="104" rx="18" fill="#FFFFFF" stroke={stroke} />
        <text x="476" y="334" fontSize="16" fontWeight="700" fill={text}>Status</text>
        <rect x="476" y="352" width="78" height="14" rx="7" fill="#E5E7EB" />
        <rect x="476" y="378" width="56" height="14" rx="7" fill="#E5E7EB" />
        <rect x="476" y="404" width="92" height="14" rx="7" fill="#DDD6FE" />
      </svg>
    );
  }

  if (type === 'payments') {
    return (
      <svg viewBox="0 0 760 560" className="untitled-svg" aria-hidden="true">
        <defs><filter id="shadowC" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#111827" floodOpacity="0.08" /></filter></defs>
        <g filter="url(#shadowC)"><rect x="80" y="96" width="250" height="332" rx="28" fill={card} stroke={stroke} /></g>
        <text x="110" y="142" fontSize="22" fontWeight="700" fill={text}>Invoice</text>
        <text x="110" y="174" fontSize="15" fill={muted}>ASB Logistics Inc.</text>
        {Array.from({ length: 5 }).map((_,i)=><g key={i}><rect x="110" y={214+i*34} width="92" height="12" rx="6" fill="#E5E7EB" /><rect x="240" y={214+i*34} width="58" height="12" rx="6" fill="#E5E7EB" /></g>)}
        <rect x="110" y="408" width="190" height="1" fill={line} />
        <text x="110" y="446" fontSize="18" fontWeight="600" fill={muted}>Total</text>
        <text x="230" y="446" fontSize="28" fontWeight="700" fill={accent}>$8,405</text>
        <g filter="url(#shadowC)"><rect x="322" y="132" width="360" height="268" rx="28" fill={card} stroke={stroke} /></g>
        <text x="350" y="174" fontSize="22" fontWeight="700" fill={text}>Driver expenses</text>
        {Array.from({ length: 6 }).map((_,i)=><g key={i}><rect x="350" y={214+i*28} width="80" height="10" rx="5" fill="#E5E7EB" /><rect x="460" y={214+i*28} width="90" height="10" rx="5" fill="#E5E7EB" /><rect x="592" y={210+i*28} width="62" height="18" rx="9" fill={i % 2 === 0 ? '#ECFDF3' : '#FEF3C7'} /></g>)}
        <g filter="url(#shadowC)"><rect x="430" y="392" width="220" height="100" rx="22" fill={card} stroke={stroke} /></g>
        <text x="456" y="430" fontSize="18" fontWeight="600" fill={text}>Weekly cashflow</text>
        <path d="M456 462 C482 440, 512 476, 540 448 S596 430, 624 446" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'drive') {
    return (
      <svg viewBox="0 0 760 560" className="untitled-svg" aria-hidden="true">
        <defs><filter id="shadowD" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#111827" floodOpacity="0.08" /></filter></defs>
        <g filter="url(#shadowD)"><rect x="74" y="86" width="612" height="380" rx="30" fill={card} stroke={stroke} /></g>
        <text x="110" y="136" fontSize="22" fontWeight="700" fill={text}>Driver 3: Michael Chen</text>
        <rect x="110" y="158" width="120" height="32" rx="16" fill="#F3F4F6" />
        <text x="136" y="179" fontSize="15" fontWeight="600" fill={muted}>11h - drive</text>
        <rect x="110" y="208" width="120" height="32" rx="16" fill="#F3F4F6" />
        <text x="136" y="229" fontSize="15" fontWeight="600" fill={muted}>14h - on duty</text>
        <rect x="252" y="168" width="390" height="232" rx="22" fill={soft} stroke={stroke} />
        {Array.from({ length: 12 }).map((_,i)=><line key={i} x1={280+i*30} y1="184" x2={280+i*30} y2="384" stroke={line} />)}
        {Array.from({ length: 4 }).map((_,i)=><line key={i} x1="252" y1={212+i*46} x2="642" y2={212+i*46} stroke={line} />)}
        <path d="M252 306 H318 V232 H410 V318 H498 V260 H592 V352 H642" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <g filter="url(#shadowD)"><rect x="328" y="280" width="96" height="74" rx="18" fill={card} stroke={stroke} /></g>
        <text x="350" y="312" fontSize="18" fontWeight="700" fill={text}>2h 15m</text>
        <text x="350" y="336" fontSize="14" fill={muted}>Remaining drive</text>
      </svg>
    );
  }

  if (type === 'map') {
    return (
      <svg viewBox="0 0 760 560" className="untitled-svg" aria-hidden="true">
        <defs><filter id="shadowE" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#111827" floodOpacity="0.08" /></filter></defs>
        <g filter="url(#shadowE)"><rect x="86" y="104" width="250" height="312" rx="28" fill={card} stroke={stroke} /></g>
        <text x="116" y="148" fontSize="22" fontWeight="700" fill={text}>Optimal route</text>
        <text x="116" y="174" fontSize="14" fill={muted}>Found 10 loads. Filtered by driver preferences.</text>
        {Array.from({ length: 4 }).map((_,i)=><g key={i}><rect x="116" y={212+i*50} width="190" height="38" rx="12" fill="#F9FAFB" stroke={stroke} /><rect x="132" y={226+i*50} width="72" height="10" rx="5" fill="#E5E7EB" /><rect x="216" y={226+i*50} width="44" height="10" rx="5" fill="#E5E7EB" /></g>)}
        <g filter="url(#shadowE)"><rect x="368" y="104" width="304" height="312" rx="28" fill={card} stroke={stroke} /></g>
        <path d="M422 362 C454 302, 512 320, 548 240 S614 164, 628 146" fill="none" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
        <circle cx="430" cy="352" r="10" fill={accent} /><circle cx="490" cy="306" r="10" fill={accent} /><circle cx="548" cy="240" r="10" fill={accent} /><circle cx="628" cy="146" r="10" fill={accent} />
        <rect x="518" y="126" width="120" height="34" rx="17" fill={card} stroke={stroke} />
        <text x="540" y="148" fontSize="14" fontWeight="600" fill={text}>Fentress County</text>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 760 560" className="untitled-svg" aria-hidden="true">
      <defs><filter id="shadowF" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#111827" floodOpacity="0.08" /></filter></defs>
      <g filter="url(#shadowF)"><rect x="84" y="96" width="592" height="336" rx="28" fill={card} stroke={stroke} /></g>
      <rect x="112" y="122" width="188" height="42" rx="14" fill="#FFFFFF" stroke={stroke} />
      <rect x="326" y="122" width="108" height="42" rx="14" fill="#FFFFFF" stroke={stroke} />
      <rect x="446" y="122" width="182" height="42" rx="14" fill="#FFFFFF" stroke={stroke} />
      <text x="130" y="149" fontSize="15" fontWeight="600" fill={muted}>Origin</text>
      <text x="350" y="149" fontSize="15" fontWeight="600" fill={muted}>DH-O</text>
      <text x="470" y="149" fontSize="15" fontWeight="600" fill={muted}>Destination</text>
      <text x="112" y="206" fontSize="18" fontWeight="700" fill={text}>24 results</text>
      <rect x="200" y="184" width="122" height="30" rx="15" fill={accentSoft} />
      <text x="218" y="204" fontSize="14" fontWeight="700" fill={accent}>+812 similar results</text>
      {Array.from({ length: 6 }).map((_,i)=><g key={i}><rect x="112" y={236+i*28} width="110" height="10" rx="5" fill="#E5E7EB" /><rect x="274" y={236+i*28} width="100" height="10" rx="5" fill="#E5E7EB" /><rect x="432" y={236+i*28} width="92" height="10" rx="5" fill="#E5E7EB" /><rect x="566" y={236+i*28} width="54" height="10" rx="5" fill="#E5E7EB" /></g>)}
    </svg>
  );
}

function VideoStatementSection() {
  return (
    <section className="video-statement-section">
      <video
        className="video-statement-media"
        src="/videos/cardboard-boxes.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
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
    <section className="final-cta-section">
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
            y: 44,
            rotateX: 8,
            filter: "blur(14px)",
            clipPath: "inset(0 0 100% 0)",
            transformOrigin: "50% 100%",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            delay: Math.min((index % 4) * 0.035, 0.12),
            ease: "power4.out",
            scrollTrigger: {
              trigger: item,
              start: "top 88%",
              end: "bottom 18%",
              toggleActions: "play none none reverse",
              once: false,
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
        <SectionLetterBridge label="TRUST" eyebrow="03 / Proof" />
        <TrustMetricsSection />
        <WhoForSection />
        <SectionLetterBridge label="TOOLS" eyebrow="05 / Ecosystem" />
        <ProductsSection />
        <VideoStatementSection />
        <GeometryPhysicsSection />
        <FinalCTASection />
        <Footer />
      </main>
    </>
  );
}
