import { createContext, useContext } from 'react';
import type { ToastMessage, ToastVariant } from '../types';

export interface ToastContextValue {
    toasts: ToastMessage[];
    showToast: (message: string, variant?: ToastVariant) => void;
    dismissToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}
