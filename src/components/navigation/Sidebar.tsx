/* ─────────────────────────────────────────────
   Admin dashboard sidebar navigation.
   Responsive — collapses to icons on small screens.
   ───────────────────────────────────────────── */

import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

import { useAuth } from '../../hooks/useAuth';

const adminItems = [
  { icon: '📊', label: 'Analytics', to: '/admin' },
  { icon: '📈', label: 'BI Dashboard', to: '/admin?tab=bi' },
  { icon: '🎫', label: 'Bookings', to: '/admin?tab=bookings' },
  { icon: '🚐', label: 'Routes', to: '/admin?tab=routes' },
  { icon: '👥', label: 'Staff', to: '/admin?tab=staff' },
  { icon: '⚙️', label: 'Settings', to: '/admin?tab=settings' },
];

const driverItems = [
  { icon: '🚐', label: 'My Trip', to: '/driver' },
  { icon: '📋', label: 'Manifest', to: '/driver' },
  { icon: '⛽', label: 'Expenses', to: '/driver?tab=expenses' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navItems = user?.role === 'driver' ? driverItems : adminItems;

  return (
    <motion.aside
      className="admin-sidebar"
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="sidebar-brand">
        <span className="logo" style={{ fontSize: 18 }}>Ven<span>Service</span></span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ icon, label, to }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{icon}</span>
            <span className="sidebar-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-item" onClick={logout} style={{ cursor: 'pointer' }}>
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Logout</span>
        </div>
      </div>
    </motion.aside>
  );
}
