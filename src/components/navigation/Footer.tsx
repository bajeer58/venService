/* ─────────────────────────────────────────────
   Site footer with links, badges, and branding.
   ───────────────────────────────────────────── */

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">Ven<span>Service</span></div>
            <p>
              Pakistan's most reliable intercity seat booking platform.
              Built for passengers, staff, and operators.
            </p>
          </div>

          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/booking">Book Tickets</Link></li>
              <li><Link to="/booking">View Schedules</Link></li>
              <li><a href="#">Track Van</a></li>
              <li><a href="#">Download App</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Operators</h4>
            <ul>
              <li><Link to="/admin?tab=staff">Staff Portal</Link></li>
              <li><Link to="/admin">Admin Dashboard</Link></li>
              <li><a href="#">API Docs</a></li>
              <li><a href="#">Partner Program</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">© 2025 Ven Service. All rights reserved.</div>
          <div className="footer-badges">
            <span className="f-badge">PCI-DSS Compliant</span>
            <span className="f-badge">256-bit SSL</span>
            <span className="f-badge">99.8% Uptime</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
