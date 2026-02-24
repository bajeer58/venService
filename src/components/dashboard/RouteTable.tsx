/* ─────────────────────────────────────────────
   Route & schedule management table.
   Displays routes with actions (edit, toggle).
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import { POPULAR_ROUTES } from '../../utils/constants';
import { formatPKR } from '../../utils/formatters';
import { useToast } from '../../context/ToastContextInstance';

export default function RouteTable() {
  const { showToast } = useToast();

  return (
    <motion.div
      className="panel-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="manifest-panel-header">
        <div className="panel-title" style={{ marginBottom: 0 }}>
          🗺️ Route Management
        </div>
        <button
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: '7px 14px' }}
          onClick={() => showToast('Route editor opened!')}
        >
          + Add Route
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="manifest-table">
          <thead>
            <tr>
              <th>Route</th>
              <th>Price</th>
              <th>Departure</th>
              <th>Duration</th>
              <th>Seats Left</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {POPULAR_ROUTES.map((route) => (
              <tr key={route.id}>
                <td style={{ fontWeight: 500 }}>{route.from} → {route.to}</td>
                <td>{formatPKR(route.price)}</td>
                <td>{route.departureTime}</td>
                <td>{route.duration}</td>
                <td>{route.seatsLeft}</td>
                <td>
                  <span
                    className="status-dot"
                    style={{
                      background: route.seatsLeft === 0
                        ? 'var(--red)'
                        : route.seatsLeft <= 5
                          ? 'var(--amber)'
                          : 'var(--green)',
                    }}
                  />
                  {route.seatsLeft === 0 ? 'Full' : 'Active'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
