/* ─────────────────────────────────────────────
   HomePage.tsx — venService v2.0
   Flixbus/Busbud-inspired premium landing page.
   ───────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContextInstance';
import { useToast } from '../context/ToastContextInstance';
import {
  POPULAR_ROUTES, QUICK_ROUTES, HOW_IT_WORKS,
  FEATURES, HERO_STATS, CITIES,
} from '../utils/constants';
import { formatPKR } from '../utils/formatters';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

// ── Animation helpers ─────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: 'easeOut' as const },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

// ── Trust bar items ─────────────────────────────────────────
const TRUST_ITEMS = [
  { icon: '⚡', text: 'Real-time Seat Selection' },
  { icon: '🔒', text: 'Secure Payments' },
  { icon: '📱', text: 'QR E-Tickets' },
  { icon: '🚐', text: 'Live Van Tracking' },
  { icon: '⭐', text: '4.9/5 Passenger Rating' },
  { icon: '🛡️', text: 'RBAC Security' },
  { icon: '📊', text: 'Admin Analytics' },
  { icon: '🇵🇰', text: 'Serving 38 Cities' },
];

// ── Component ─────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const { state, setRoute, setDate, openModal } = useBooking();
  const { showToast } = useToast();

  function handleQuickRoute(from: string, to: string) {
    setRoute(from, to);
    showToast(`Route set: ${from} → ${to}`, 'success', 'Route Selected 🚐');
    navigate('/booking');
  }

  function handleSearch() { navigate('/booking'); }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >

      {/* ══════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════ */}

      <div id="hero">
        <div className="hero-grid-bg" aria-hidden="true" />
        <div className="hero-orb" aria-hidden="true" />

        {/* Floating badge */}
        <motion.div className="hero-badge" {...fadeUp(0.15)}>
          🚐 Pakistan's Smartest Intercity Booking Platform
        </motion.div>

        {/* Headline */}
        <motion.h1 {...fadeUp(0.25)}>
          Book Your Seat,<br />
          <span className="accent">Instantly.</span>
          <span className="line2">Travel Smarter.</span>
        </motion.h1>

        <motion.p className="hero-sub" {...fadeUp(0.35)}>
          Real-time seat selection, QR-coded tickets, and live van tracking —
          all in one platform for passengers, staff, and operators.
        </motion.p>

        {/* Search card */}
        <motion.div className="search-card" {...fadeUp(0.45)}>
          <div className="search-row" role="search" aria-label="Search for routes">
            <div className="field">
              <label htmlFor="hero-from">From</label>
              <select
                id="hero-from"
                value={state.fromCity}
                onChange={e => setRoute(e.target.value, state.toCity)}
                aria-label="Departure city"
              >
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="hero-to">To</label>
              <select
                id="hero-to"
                value={state.toCity}
                onChange={e => setRoute(state.fromCity, e.target.value)}
                aria-label="Destination city"
              >
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="hero-date">Date</label>
              <input
                id="hero-date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={state.travelDate}
                onChange={e => setDate(e.target.value)}
                aria-label="Travel date"
              />
            </div>
            <button
              className="search-btn-main"
              onClick={handleSearch}
              aria-label="Search available seats"
            >
              Search Seats →
            </button>
          </div>

          {/* Quick route pills */}
          <div className="quick-links" role="list" aria-label="Popular routes">
            {QUICK_ROUTES.map(({ from, to }) => (
              <button
                key={`${from}-${to}`}
                role="listitem"
                className="quick-link"
                onClick={() => handleQuickRoute(from, to)}
                aria-label={`Quick route ${from} to ${to}`}
              >
                🚐 {from} → {to}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div className="stats-row" {...fadeUp(0.6)}>
          {HERO_STATS.map(({ value, suffix, label }) => (
            <div className="stat-item" key={label}>
              <div className="num">
                <AnimatedCounter value={parseInt(value)} suffix={suffix} duration={1800} />
              </div>
              <div className="lbl">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════
          TRUST BAR — scrolling marquee
          ══════════════════════════════════════════════════ */}

      <div className="trust-bar" aria-label="Platform features">
        <div className="trust-track" aria-hidden="true">
          {/* Double items for infinite loop */}
          {[...TRUST_ITEMS, ...TRUST_ITEMS].map(({ icon, text }, i) => (
            <div key={i} className="trust-item">
              <span className="ti-icon">{icon}</span>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          POPULAR ROUTES
          ══════════════════════════════════════════════════ */}

      <section id="routes" aria-labelledby="routes-heading">
        <div className="routes-header">
          <div>
            <motion.div className="section-label" {...fadeIn()}>
              Popular Routes
            </motion.div>
            <motion.h2 id="routes-heading" {...fadeIn(0.1)}>
              Find Your <span className="hi">Journey</span>
            </motion.h2>
            <motion.p className="section-desc" {...fadeIn(0.15)}>
              Live seat availability updated every 30 seconds across all routes.
            </motion.p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => showToast('Showing all 38 routes...', 'info')}
            aria-label="View all available routes"
          >
            View All Routes →
          </Button>
        </div>

        <div className="routes-grid">
          {POPULAR_ROUTES.map((route, i) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card
                className="route-card"
                onClick={() => {
                  setRoute(route.from, route.to);
                  navigate('/booking');
                }}
                aria-label={`Book ${route.from} to ${route.to}, ${formatPKR(route.price)} per seat`}
              >
                {/* Image banner */}
                <div
                  className={`route-img route-img-${route.from.toLowerCase()}`}
                  aria-hidden="true"
                >
                  <span>{route.emoji}</span>
                </div>
                {/* Card body */}
                <div className="route-body">
                  <Badge variant={
                    route.seatsLeft === 0 ? 'danger' :
                      route.seatsLeft <= 5 ? 'warning' : 'success'
                  } pulse={route.seatsLeft !== 0}>
                    {route.seatsLeft === 0 ? 'Full' : `${route.seatsLeft} seats left`}
                  </Badge>
                  <div className="route-from-to">
                    {route.from} <span className="arrow">→</span> {route.to}
                  </div>
                  <div className="route-meta">
                    <div className="route-price">
                      {formatPKR(route.price)} <span>/seat</span>
                    </div>
                    <div className="route-info">
                      🕐 {route.departureTime}<br />
                      ⏱ {route.duration}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="divider" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════ */}

      <section id="how" aria-labelledby="how-heading">
        <div style={{ textAlign: 'center' }}>
          <motion.div className="section-label" {...fadeIn()}>
            How It Works
          </motion.div>
          <motion.h2 id="how-heading" {...fadeIn(0.1)}>
            Book in <span className="hi">4 Simple Steps</span>
          </motion.h2>
        </div>

        <div className="steps-grid">
          {HOW_IT_WORKS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Card className="step-card" hoverable={false}>
                {/* Icon well */}
                <div className="step-icon-wrap">
                  {step.icon}
                  <div className="step-number" aria-hidden="true">{step.num}</div>
                </div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="divider" aria-hidden="true" />

      {/* ══════════════════════════════════════════════════
          FEATURES — Bento grid
          ══════════════════════════════════════════════════ */}

      <section id="features" aria-labelledby="features-heading">
        <div className="features-intro">
          <div className="features-intro-left">
            <motion.div className="section-label" {...fadeIn()}>
              Platform Features
            </motion.div>
            <motion.h2 id="features-heading" {...fadeIn(0.1)}>
              Everything You <span className="hi">Need</span>
            </motion.h2>
          </div>
          <div className="features-intro-right">
            <motion.p className="section-desc" style={{ textAlign: 'right', maxWidth: '100%' }} {...fadeIn(0.15)}>
              From real-time seat maps to enterprise analytics — built for operators at scale.
            </motion.p>
          </div>
        </div>

        <div className="features-grid">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="feat-card"
              style={{ gridColumn: undefined }}   // let CSS bento rules control span
            >
              <div className="feat-icon" aria-hidden="true">{feat.icon}</div>
              <div className="feat-title">{feat.title}</div>
              <div className="feat-desc">{feat.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BANNER
          ══════════════════════════════════════════════════ */}

      <section id="cta" aria-labelledby="cta-heading">
        <motion.div
          className="cta-inner"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="cta-title" id="cta-heading">Ready to Go Live?</div>
          <p className="cta-sub">
            Launch your intercity booking platform in weeks, not months. <br />
            Join 120+ operators across Pakistan.
          </p>
          <div className="cta-buttons">
            <Button
              variant="primary"
              size="lg"
              onClick={openModal}
              aria-label="Book a demo"
            >
              🚐 Book a Demo
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => showToast('Pricing deck sent to your email! 📧', 'info')}
              aria-label="View pricing"
            >
              View Pricing
            </Button>
          </div>

          {/* Trust tags */}
          <div className="cta-trust" aria-label="Trust indicators">
            {[
              { icon: '✓', text: 'No setup fee' },
              { icon: '✓', text: 'Free 30-day trial' },
              { icon: '✓', text: 'Cancel anytime' },
            ].map(({ icon, text }) => (
              <div key={text} className="cta-trust-item">
                <span aria-hidden="true">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════ */}

      <footer role="contentinfo">
        <div className="footer-inner">
          <div className="footer-grid">
            {/* Brand column */}
            <div className="footer-brand">
              <div className="logo">Ven<span>Service</span></div>
              <p>
                Pakistan's leading intercity van booking platform.
                Connecting cities, empowering operators, and giving
                passengers a smarter way to travel.
              </p>
              <div className="footer-socials">
                {['𝕏', 'in', 'fb', 'yt'].map(s => (
                  <a
                    key={s}
                    href="#"
                    className="footer-social-btn"
                    aria-label={`Visit our ${s} page`}
                    onClick={e => e.preventDefault()}
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Product */}
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li><a href="#routes">Routes</a></li>
                <li><a href="/booking">Book Seat</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#how">How It Works</a></li>
              </ul>
            </div>

            {/* Platform */}
            <div className="footer-col">
              <h4>Platform</h4>
              <ul>
                <li><a href="/admin">Admin Panel</a></li>
                <li><a href="/driver">Driver Portal</a></li>
                <li><a href="/verify">QR Verify</a></li>
                <li><a href="#">API Docs</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-copy">
              © 2025 venService. All rights reserved.
            </div>
            <div className="footer-badges">
              <span className="f-badge">🔒 SSL Secured</span>
              <span className="f-badge">⚡ 99.9% Uptime</span>
              <span className="f-badge">🇵🇰 Made in Pakistan</span>
            </div>
          </div>
        </div>
      </footer>

    </motion.div>
  );
}