// src/shared/components/molecules/Toast/index.tsx
// ─────────────────────────────────────────────────────────────
// Global toast notification system.
// Uses a module-level event bus so it works outside React trees
// (e.g., in service layer callbacks).
// ─────────────────────────────────────────────────────────────

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../../utils/cn';

// ── Types ─────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration?: number;  // ms, default 4000
  action?: { label: string; onClick: () => void };
}

// ── Event Bus (module-level — works outside React) ────────────

type ToastListener = (toast: Toast) => void;
type DismissListener = (id: string) => void;

const listeners = new Set<ToastListener>();
const dismissListeners = new Set<DismissListener>();

let _idCounter = 0;

export const toast = {
  show: (options: Omit<Toast, 'id'>): string => {
    const id = `toast-${++_idCounter}`;
    const t: Toast = { duration: 4000, ...options, id };
    listeners.forEach(fn => fn(t));
    return id;
  },
  success: (title: string, description?: string) =>
    toast.show({ variant: 'success', title, description }),
  error: (title: string, description?: string) =>
    toast.show({ variant: 'error', title, description, duration: 6000 }),
  warning: (title: string, description?: string) =>
    toast.show({ variant: 'warning', title, description }),
  info: (title: string, description?: string) =>
    toast.show({ variant: 'info', title, description }),
  dismiss: (id: string) => {
    dismissListeners.forEach(fn => fn(id));
  },
};

// ── Individual Toast ──────────────────────────────────────────

const toastStyles: Record<ToastVariant, { container: string; icon: ReactNode }> = {
  success: {
    container: 'border-success-base/20 bg-white',
    icon: (
      <span className="flex-shrink-0 w-5 h-5 text-success-base">
        <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
        </svg>
      </span>
    ),
  },
  error: {
    container: 'border-danger-base/20 bg-white',
    icon: (
      <span className="flex-shrink-0 w-5 h-5 text-danger-base">
        <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
        </svg>
      </span>
    ),
  },
  warning: {
    container: 'border-warning-base/20 bg-white',
    icon: (
      <span className="flex-shrink-0 w-5 h-5 text-warning-dark">
        <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
      </span>
    ),
  },
  info: {
    container: 'border-info-base/20 bg-white',
    icon: (
      <span className="flex-shrink-0 w-5 h-5 text-info-base">
        <svg fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
        </svg>
      </span>
    ),
  },
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast: t, onDismiss }: ToastItemProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const style = toastStyles[t.variant];

  useEffect(() => {
    if (t.duration && t.duration > 0) {
      timerRef.current = setTimeout(() => onDismiss(t.id), t.duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [t.id, t.duration, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        'flex items-start gap-3 p-4 rounded-xl border shadow-elevated max-w-sm w-full',
        style.container
      )}
    >
      {style.icon}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900">{t.title}</p>
        {t.description && (
          <p className="text-sm text-neutral-500 mt-0.5">{t.description}</p>
        )}
        {t.action && (
          <button
            onClick={t.action.onClick}
            className="text-sm font-medium text-brand-600 hover:text-brand-700 mt-1.5 focus-visible:outline-none focus-visible:underline"
          >
            {t.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(t.id)}
        className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded"
        aria-label="Dismiss notification"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
      </button>
    </motion.div>
  );
}

// ── Toaster (mount once in app root) ─────────────────────────

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Toast) => {
    setToasts(prev => [...prev.slice(-4), t]); // max 5 visible
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => {
    listeners.add(addToast);
    dismissListeners.add(removeToast);
    return () => {
      listeners.delete(addToast);
      dismissListeners.delete(removeToast);
    };
  }, [addToast, removeToast]);

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none"
      aria-label="Notifications"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onDismiss={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
