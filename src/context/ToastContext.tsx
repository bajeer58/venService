/* ═══════════════════════════════════════════════════════════
   ToastContext.tsx — venService v2.0
   Context + hook + provider + UI renderer — one file.
   ═══════════════════════════════════════════════════════════ */

import React, {
  createContext, useContext, useState, useCallback,
  useEffect, useRef, type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ToastVariant } from '../types';

// ── Types ─────────────────────────────────────────────────────

export interface Toast {
  id: string;
  message: string;
  title?: string;
  variant: ToastVariant | 'warning';
  duration: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, variant?: ToastVariant | 'warning', title?: string, duration?: number) => void;
  dismissToast: (id: string) => void;
}

// ── Context ───────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);
ToastContext.displayName = 'ToastContext';

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
}

// ── Icons ─────────────────────────────────────────────────────

const ICONS: Record<string, string> = {
  success: '✓',
  error: '✕',
  info: 'i',
  warning: '!',
};

const COLORS: Record<string, string> = {
  success: 'var(--green-400)',
  error: 'var(--red-400)',
  info: 'var(--blue-300)',
  warning: 'var(--amber-400)',
};

// ── Toast item component ──────────────────────────────────────

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const color = COLORS[toast.variant] ?? COLORS.info;
  const icon = ICONS[toast.variant] ?? 'i';
  const barRef = useRef<HTMLDivElement>(null);

  // Animate the progress bar
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    bar.style.transition = `width ${toast.duration}ms linear`;
    const frame = requestAnimationFrame(() => { bar.style.width = '0%'; });
    return () => cancelAnimationFrame(frame);
  }, [toast.duration]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{
        position: 'relative',
        background: 'var(--surface2)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${color}`,
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4) var(--space-5)',
        paddingRight: 'var(--space-10)',
        display: 'flex',
        gap: 'var(--space-3)',
        alignItems: 'flex-start',
        boxShadow: 'var(--shadow-lg)',
        minWidth: 280,
        maxWidth: 400,
        overflow: 'hidden',
      }}
    >
      {/* Icon */}
      <div
        aria-hidden="true"
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: `${color}22`,
          border: `1px solid ${color}44`,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {icon}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text)', marginBottom: 2 }}>
            {toast.title}
          </div>
        )}
        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {toast.message}
        </div>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Dismiss notification"
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'none',
          border: 'none',
          color: 'var(--muted)',
          cursor: 'pointer',
          fontSize: 16,
          lineHeight: 1,
          padding: '2px 4px',
          borderRadius: 'var(--radius-xs)',
        }}
      >
        ×
      </button>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 2,
          background: 'var(--border)',
        }}
      >
        <div
          ref={barRef}
          style={{
            height: '100%',
            width: '100%',
            background: color,
          }}
        />
      </div>
    </motion.div>
  );
};

// ── Provider ──────────────────────────────────────────────────

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((
    message: string,
    variant: ToastVariant | 'warning' = 'success',
    title?: string,
    duration: number = 3500,
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast: Toast = { id, message, variant, title, duration };

    setToasts(prev => [...prev.slice(-4), toast]); // max 5 at once
    setTimeout(() => dismissToast(id), duration);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}

      {/* Toast renderer — mounted globally inside the provider */}
      <div
        aria-label="Notifications"
        aria-live="polite"
        style={{
          position: 'fixed',
          bottom: 'var(--space-6)',
          right: 'var(--space-6)',
          zIndex: 'var(--z-toast)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-3)',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} style={{ pointerEvents: 'auto' }}>
              <ToastItem toast={t} onClose={() => dismissToast(t.id)} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
