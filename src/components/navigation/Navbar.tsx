/* ─────────────────────────────────────────────
   Main navigation bar.
   Sticky top nav with logo, links, and action buttons.
   ───────────────────────────────────────────── */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContextInstance';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const { openModal } = useBooking();
  const isHome = location.pathname === '/';

  /** Scroll to section on homepage, or navigate then scroll */
  function scrollTo(sectionId: string) {
    if (isHome) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${sectionId}`);
    }
  }

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        Ven<span>Service</span><em>BETA</em>
      </Link>

      <ul className="nav-links">
        <li><a onClick={() => scrollTo('routes')} style={{ cursor: 'pointer' }}>Routes</a></li>
        <li><Link to="/booking">Book Seat</Link></li>
        {hasRole(['admin', 'staff']) && <li><Link to="/admin">Dashboard</Link></li>}
        {hasRole(['driver']) && <li><Link to="/driver">Driver</Link></li>}
        <li><a onClick={() => scrollTo('features')} style={{ cursor: 'pointer' }}>Features</a></li>
      </ul>

      <div className="nav-actions">
        {isAuthenticated ? (
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="user-info" style={{ textAlign: 'right' }}>
              <div className="user-name" style={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>{user?.name}</div>
              <div className="user-role" style={{ color: 'var(--accent)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} style={{ fontSize: '12px', padding: '6px 12px' }}>
              Logout
            </Button>
          </div>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => navigate('/admin')}>
              Login
            </button>
            <button className="btn btn-primary" onClick={openModal}>
              Book Now
            </button>
          </>
        )}
      </div>
    </motion.nav>
  );
}
