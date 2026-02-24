/* ─────────────────────────────────────────────
   Toast notification context.
   Provides showToast() globally to any component.
   ───────────────────────────────────────────── */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { ToastMessage, ToastVariant } from '../types';

interface ToastContextValue {
  toasts: ToastMessage[];
  showToast: (message: string, variant?: ToastVariant) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 3200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const toast: ToastMessage = { id, message, variant };

    setToasts(prev => [...prev, toast]);

    // Auto-dismiss after duration
    setTimeout(() => dismissToast(id), TOAST_DURATION);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      {children}
    </ToastContext.Provider>
  );
}

/** Access toast notifications from any component */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
