/* ═══════════════════════════════════════════════════════════
   src/shared/components/molecules/Toast/index.tsx
   venService v2.0
   Toast molecule — wraps react-hot-toast with typed
   helpers and a custom themed renderer.
   ═══════════════════════════════════════════════════════════ */

import { toast as hotToast, type Toast as HotToastInstance } from 'react-hot-toast';
import type { ToastVariant } from '../../../types/domain';
import { cx } from '../../../../lib';

// ── Icon map ───────────────────────────────────────────────

const ICONS: Record<ToastVariant, string> = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
};

// ── CSS class map ──────────────────────────────────────────

const VARIANT_CLASS: Record<ToastVariant, string> = {
    success: 'toast--success',
    error: 'toast--error',
    warning: 'toast--warning',
    info: 'toast--info',
};

// ── Custom toast renderer ──────────────────────────────────

interface ToastContentProps {
    t: HotToastInstance;
    message: string;
    variant: ToastVariant;
}

function ToastContent({ t, message, variant }: ToastContentProps) {
    return (
        <div
            className={cx(
                'toast',
                VARIANT_CLASS[variant],
                t.visible ? 'toast--enter' : 'toast--exit',
            )}
            role="status"
            aria-live="polite"
        >
            <span className="toast__icon" aria-hidden="true">
                {ICONS[variant]}
            </span>
            <p className="toast__message">{message}</p>
            <button
                className="toast__close"
                onClick={() => hotToast.dismiss(t.id)}
                aria-label="Dismiss notification"
            >
                ×
            </button>
        </div>
    );
}

// ── Typed toast helpers ────────────────────────────────────

export interface ToastOptions {
    duration?: number;
    id?: string;
}

/**
 * Show a success toast.
 * @example toast.success('Booking confirmed!');
 */
function success(message: string, opts?: ToastOptions): string {
    return hotToast.custom(
        t => <ToastContent t={t} message={message} variant="success" />,
        { duration: opts?.duration ?? 4000, id: opts?.id },
    );
}

/**
 * Show an error toast.
 */
function error(message: string, opts?: ToastOptions): string {
    return hotToast.custom(
        t => <ToastContent t={t} message={message} variant="error" />,
        { duration: opts?.duration ?? 6000, id: opts?.id },
    );
}

/**
 * Show a warning toast.
 */
function warning(message: string, opts?: ToastOptions): string {
    return hotToast.custom(
        t => <ToastContent t={t} message={message} variant="warning" />,
        { duration: opts?.duration ?? 5000, id: opts?.id },
    );
}

/**
 * Show an info toast.
 */
function info(message: string, opts?: ToastOptions): string {
    return hotToast.custom(
        t => <ToastContent t={t} message={message} variant="info" />,
        { duration: opts?.duration ?? 4000, id: opts?.id },
    );
}

/**
 * Dismiss all or a specific toast by ID.
 */
function dismiss(id?: string): void {
    hotToast.dismiss(id);
}

/**
 * Promise-based toast — shows loading → success/error.
 */
function promise<T>(
    p: Promise<T>,
    messages: { loading: string; success: string; error: string },
): Promise<T> {
    return hotToast.promise(p, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
    });
}

// ── Named export ───────────────────────────────────────────

export const toast = {
    success,
    error,
    warning,
    info,
    dismiss,
    promise,
};

export default toast;
