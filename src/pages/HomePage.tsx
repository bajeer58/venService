/* ─────────────────────────────────────────────
   Home / Landing page.
   Hero, routes, how it works, features, CTA.
   ───────────────────────────────────────────── */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import {
  POPULAR_ROUTES, QUICK_ROUTES, HOW_IT_WORKS,
  FEATURES, HERO_STATS, CITIES,
} from '../utils/constants';
import { formatPKR } from '../utils/formatters';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const { state, setRoute, setDate, openModal } = useBooking();
  const { showToast } = useToast();

  /** Handle quick route selection */
  function handleQuickRoute(from: string, to: string) {
    setRoute(from, to);
    showToast(`Route set: ${from} → ${to} 🚐`);
    navigate('/booking');
  }

  /** Handle search button */
  function handleSearch() {
    navigate('/booking');
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── HERO ──────────────────────────────────────── */}
      <div id="hero">
        <div className="hero-grid-bg" />
        <div className="hero-orb" />

        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          🚐 Pakistan's Smartest Intercity Booking Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Book Your Seat,<br />
          <span className="accent">Instantly.</span>
          <span className="line2">Travel Smarter.</span>
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Real-time seat selection, QR-coded tickets, and live van tracking — all in one platform for
          passengers, staff, and operators.
        </motion.p>

        {/* Search card */}
        <motion.div
          className="search-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="search-row">
            <div className="field">
              <label>From</label>
              <select
                value={state.fromCity}
                onChange={(e) => setRoute(e.target.value, state.toCity)}
              >
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>To</label>
              <select
                value={state.toCity}
                onChange={(e) => setRoute(state.fromCity, e.target.value)}
              >
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={state.travelDate}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <button className="search-btn-main" onClick={handleSearch}>
              Search →
            </button>
          </div>

          {/* Quick routes */}
          <div className="quick-links">
            {QUICK_ROUTES.map(({ from, to }) => (
              <div
                key={`${from}-${to}`}
                className="quick-link"
                onClick={() => handleQuickRoute(from, to)}
              >
                🚐 {from} → {to}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="stats-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
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

      <div className="divider" />

      {/* ── POPULAR ROUTES ────────────────────────────── */}
      <section id="routes">
        <div className="routes-header">
          <div>
            <motion.div
              className="section-label"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              Popular Routes
            </motion.div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Find Your <span className="hi">Journey</span>
            </motion.h2>
            <motion.p
              className="section-desc"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Live seat availability updated every 30 seconds across all routes.
            </motion.p>
          </div>
          <Button variant="ghost" onClick={() => showToast('Showing all 38 routes...')}>
            View All Routes →
          </Button>
        </div>

        <div className="routes-grid">
          {POPULAR_ROUTES.map((route, i) => (
            <Card
              key={route.id}
              className="route-card"
              delay={i * 0.08}
              onClick={() => {
                setRoute(route.from, route.to);
                navigate('/booking');
              }}
            >
              <div className={`route-img route-img-${route.from.toLowerCase()}`}>
                {route.emoji}
              </div>
              <div className="route-body">
                <Badge color={route.badgeColor}>
                  ● {route.seatsLeft === 0 ? 'Full' : `${route.seatsLeft} seats left`}
                </Badge>
                <div className="route-from-to">
                  {route.from} <span className="arrow">→</span> {route.to}
                </div>
                <div className="route-meta">
                  <div className="route-price">
                    {formatPKR(route.price)} <span>/seat</span>
                  </div>
                  <div className="route-info">
                    🕐 Dep: {route.departureTime}<br />⏱ {route.duration}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section id="how">
        <div style={{ textAlign: 'center' }}>
          <motion.div
            className="section-label"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Book in <span className="hi">4 Simple Steps</span>
          </motion.h2>
        </div>
        <div className="steps-grid">
          {HOW_IT_WORKS.map((step, i) => (
            <Card key={step.num} className="step-card" delay={i * 0.1} hoverable={false}>
              <div className="step-num">{step.num}</div>
              <span className="step-icon">{step.icon}</span>
              <div className="step-title">{step.title}</div>
              <div className="step-desc">{step.desc}</div>
              {i < HOW_IT_WORKS.length - 1 && <div className="connector" />}
            </Card>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── FEATURES ──────────────────────────────────── */}
      <section id="features">
        <motion.div
          className="section-label"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Platform Features
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Everything You <span className="hi">Need</span>
        </motion.h2>
        <div className="features-grid">
          {FEATURES.map((feat, i) => (
            <Card key={feat.title} className="feat-card" delay={i * 0.08}>
              <div className="feat-icon">{feat.icon}</div>
              <div className="feat-title">{feat.title}</div>
              <div className="feat-desc">{feat.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section id="cta">
        <motion.div
          className="cta-inner"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="cta-title">Ready to Go Live?</div>
          <p className="cta-sub">Launch your intercity booking platform in weeks, not months.</p>
          <div className="cta-buttons">
            <Button
              variant="primary"
              style={{ fontSize: 15, padding: '14px 32px' }}
              onClick={openModal}
            >
              🚐 Book a Demo
            </Button>
            <Button
              variant="ghost"
              style={{ fontSize: 15, padding: '14px 32px' }}
              onClick={() => showToast('Pricing deck sent to your email! 📧')}
            >
              View Pricing
            </Button>
          </div>
        </motion.div>
      </section>
    </motion.div>
  );
}
