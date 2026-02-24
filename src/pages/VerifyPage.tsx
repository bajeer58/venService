/* ─────────────────────────────────────────────
   QR Verification page.
   Displays three verification states: valid, invalid, used.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';

const verifyStates = [
  {
    status: 'VALID',
    icon: '✅',
    className: 'vc-valid',
    desc: 'Ticket VS-00847\nAli Hassan · Seat A-4\nKarachi → Islamabad',
  },
  {
    status: 'INVALID',
    icon: '❌',
    className: 'vc-invalid',
    desc: 'Ticket not found in system. Possible forgery or wrong route.',
  },
  {
    status: 'USED',
    icon: '⚠️',
    className: 'vc-used',
    desc: 'This ticket was already scanned at 07:54 AM. Possible duplicate.',
  },
];

export default function VerifyPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section id="verify" style={{ paddingTop: 120 }}>
        <div>
          <motion.div
            className="section-label"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            QR Verification
          </motion.div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Instant Ticket <span className="hi">Verification</span>
          </motion.h2>
          <motion.p
            className="section-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Scan QR codes at boarding. Three possible states shown below.
          </motion.p>
        </div>

        <div className="verify-demo">
          {verifyStates.map((state, i) => (
            <motion.div
              key={state.status}
              className={`verify-card ${state.className}`}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <motion.div
                className="verify-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 + i * 0.15, type: 'spring', stiffness: 300 }}
              >
                {state.icon}
              </motion.div>
              <div className="verify-status">{state.status}</div>
              <div className="verify-desc" style={{ whiteSpace: 'pre-line' }}>
                {state.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
