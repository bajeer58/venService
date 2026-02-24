/* ─────────────────────────────────────────────
   Main navigation bar.
   Sticky top nav with logo, links, and action buttons.
   ───────────────────────────────────────────── */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBooking } from '../../context/BookingContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
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
        <li><Link to="/admin">Dashboard</Link></li>
        <li><a onClick={() => scrollTo('features')} style={{ cursor: 'pointer' }}>Features</a></li>
      </ul>

      <div className="nav-actions">
        <button className="btn btn-ghost" onClick={() => navigate('/admin?tab=staff')}>
          Staff Login
        </button>
        <button className="btn btn-primary" onClick={openModal}>
          Book Now
        </button>
      </div>
    </motion.nav>
  );
}
