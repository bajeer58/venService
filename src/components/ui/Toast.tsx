/* ─────────────────────────────────────────────
   Toast notification renderer.
   Reads from ToastContext and displays all active toasts.
   ───────────────────────────────────────────── */

import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContextInstance';
import type { ToastVariant } from '../../types';

const icons: Record<ToastVariant, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
};

export default function Toast() {
  const { toasts } = useToast();

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 300,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            className="toast show"
            initial={{ opacity: 0, x: 80, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <span className="toast-icon">{icons[toast.variant]}</span>
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
