/* ─────────────────────────────────────────────
   Staff counter panel.
   Quick booking form, ticket preview, and manifest table.
   ───────────────────────────────────────────── */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import { MANIFEST_DATA } from '../../utils/constants';
import { generateTicketId } from '../../utils/formatters';
import ExportButtons from './ExportButtons';
import Button from '../ui/Button';

export default function StaffPanel() {
  const { showToast } = useToast();
  const [ticketId] = useState(generateTicketId);

  function handlePrintTicket() {
    showToast(`Ticket #${ticketId} printed successfully! ✅`);
  }

  return (
    <>
      <div className="staff-layout">
        {/* Quick Booking Form */}
        <motion.div
          className="panel-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="panel-title">⚡ Quick Booking</div>
          <div className="form-stack">
            <div className="mini-field">
              <label>Route</label>
              <select>
                <option>Karachi → Islamabad</option>
                <option>Lahore → Peshawar</option>
                <option>Multan → Lahore</option>
              </select>
            </div>
            <div className="mini-field">
              <label>Schedule</label>
              <select>
                <option>08:00 AM — Van #KI-07 (7 seats)</option>
                <option>02:00 PM — Van #KI-09 (12 seats)</option>
              </select>
            </div>
            <div className="mini-field">
              <label>Passenger Name</label>
              <input type="text" placeholder="Muhammad Ali" />
            </div>
            <div className="mini-field">
              <label>Phone Number</label>
              <input type="tel" placeholder="0300-1234567" />
            </div>
            <div className="mini-field">
              <label>Seat Number</label>
              <input type="text" placeholder="A-4" />
            </div>
            <Button
              variant="primary"
              fullWidth
              style={{ padding: 12, marginTop: 4 }}
              onClick={handlePrintTicket}
            >
              Print Ticket + Add to Manifest
            </Button>
          </div>
        </motion.div>

        {/* Ticket Preview */}
        <motion.div
          className="panel-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="panel-title">🎫 Ticket Preview (Thermal 58mm)</div>
          <div className="ticket-preview">
            <div className="tp-title">VEN SERVICE</div>
            <div style={{ fontSize: 10, marginBottom: 8 }}>Intercity Transport Booking</div>
            <div className="tp-row"><span>Ticket #:</span><span>{ticketId}</span></div>
            <div className="tp-row"><span>Passenger:</span><span>Ali Hassan</span></div>
            <div className="tp-row"><span>From:</span><span>Karachi</span></div>
            <div className="tp-row"><span>To:</span><span>Islamabad</span></div>
            <div className="tp-row"><span>Date:</span><span>26-Feb-2025</span></div>
            <div className="tp-row"><span>Time:</span><span>08:00 AM</span></div>
            <div className="tp-row"><span>Seat:</span><span>A-4</span></div>
            <div className="tp-row"><span>Van:</span><span>#KI-07</span></div>
            <div className="tp-qr">[ QR ]</div>
            <div className="tp-row"><span>Fare:</span><span>PKR 3,500</span></div>
            <div className="tp-footer">Valid for this journey only. Non-refundable.</div>
          </div>
        </motion.div>
      </div>

      {/* Manifest Table */}
      <motion.div
        className="panel-card"
        style={{ marginTop: 20 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="manifest-panel-header">
          <div className="panel-title" style={{ marginBottom: 0 }}>
            📋 Today's Manifest — Van #KI-07 · 08:00 AM
          </div>
          <ExportButtons />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="manifest-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Passenger</th>
                <th>Seat</th>
                <th>Phone</th>
                <th>Booked Via</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {MANIFEST_DATA.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.passenger}</td>
                  <td>{row.seat}</td>
                  <td>{row.phone}</td>
                  <td>{row.bookedVia}</td>
                  <td>
                    <span
                      className="status-dot"
                      style={{
                        background: row.status === 'confirmed'
                          ? 'var(--green)'
                          : row.status === 'pending'
                            ? 'var(--amber)'
                            : 'var(--muted)',
                      }}
                    />
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </>
  );
}
