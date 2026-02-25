/* ═══════════════════════════════════════════════════════════
   Navbar.tsx — venService v2.0
   Mobile-first, accessible. ARIA navigation, hamburger menu.
   ═══════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useId } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useBooking } from '../../context/BookingContextInstance';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

// ── Nav link definitions ──────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
  section?: string;        // scroll to #section on homepage
  roles?: string[];      // if set, only shown for these roles
}

const NAV_LINKS: NavLink[] = [
  { label: 'Routes', href: '/', section: 'routes' },
  { label: 'Book Seat', href: '/booking' },
  { label: 'Features', href: '/', section: 'features' },
  { label: 'Dashboard', href: '/admin', roles: ['admin', 'staff'] },
  { label: 'Driver', href: '/driver', roles: ['driver'] },
];

// ── User avatar initials ──────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ── Component ─────────────────────────────────────────────────

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { openModal } = useBooking();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Keyboard: close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const scrollTo = useCallback((sectionId: string) => {
    if (location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${sectionId}`);
    }
    setMenuOpen(false);
  }, [location.pathname, navigate]);

  /** Filter links by role */
  const visibleLinks = NAV_LINKS.filter(link => {
    if (!link.roles) return true;
    return link.roles.some(r => hasRole([r as 'admin' | 'staff' | 'driver' | 'passenger']));
  });

  const isActive = (href: string) => location.pathname === href;

  function handleLinkClick(link: NavLink) {
    if (link.section) { scrollTo(link.section); }
    else { navigate(link.href); setMenuOpen(false); }
  }

  return (
    <>
      <motion.nav
        role="navigation"
        aria-label="Main navigation"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <Link to="/" className="logo" aria-label="venService home">
          Ven<span>Service</span><em>BETA</em>
        </Link>

        {/* Desktop links */}
        <ul className="nav-links" role="list">
          {visibleLinks.map(link => (
            <li key={link.label}>
              {link.section ? (
                <a
                  role="button"
                  tabIndex={0}
                  className={isActive(link.href) ? 'active' : ''}
                  onClick={() => handleLinkClick(link)}
                  onKeyDown={e => { if (e.key === 'Enter') handleLinkClick(link); }}
                  style={{ cursor: 'pointer' }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className={isActive(link.href) ? 'active' : ''}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="nav-actions">
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div className="nav-user-chip">
                <div className="nav-user-avatar" aria-hidden="true">
                  {getInitials(user.name)}
                </div>
                <div className="nav-user-info">
                  <span className="nav-user-name">{user.name}</span>
                  <span className="nav-user-role">{user.role}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={logout} aria-label="Log out">
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" size="sm" onClick={openModal}>
                Book Now
              </Button>
            </>
          )}
        </div>

        {/* Hamburger toggle */}
        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(prev => !prev)}
        >
          <span className="bar" aria-hidden="true" />
          <span className="bar" aria-hidden="true" />
          <span className="bar" aria-hidden="true" />
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <div
        id={menuId}
        className={`nav-mobile-drawer ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
      >
        <AnimatePresence>
          {menuOpen && visibleLinks.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
            >
              {link.section ? (
                <a
                  role="button"
                  tabIndex={0}
                  className={`nav-mobile-link ${isActive(link.href) ? 'active' : ''}`}
                  onClick={() => handleLinkClick(link)}
                  onKeyDown={e => { if (e.key === 'Enter') handleLinkClick(link); }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  to={link.href}
                  className={`nav-mobile-link ${isActive(link.href) ? 'active' : ''}`}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Mobile auth actions */}
        <div className="nav-mobile-actions">
          {isAuthenticated ? (
            <Button variant="danger" fullWidth onClick={() => { logout(); setMenuOpen(false); }}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="ghost" fullWidth onClick={() => { navigate('/login'); setMenuOpen(false); }}>
                Login
              </Button>
              <Button variant="primary" fullWidth onClick={() => { openModal(); setMenuOpen(false); }}>
                Book Now
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
