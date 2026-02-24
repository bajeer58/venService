/* ─────────────────────────────────────────────
   ErrorState — display error messages in the UI.
   ───────────────────────────────────────────── */

import { motion } from 'framer-motion';
import Button from './Button';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export default function ErrorState({ message = 'Failed to load data', onRetry }: ErrorStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="error-state"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                background: 'rgba(255, 71, 87, 0.05)',
                border: '1px solid rgba(255, 71, 87, 0.2)',
                borderRadius: 16,
                textAlign: 'center'
            }}
        >
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h3 style={{ color: '#fff', marginBottom: 8, fontSize: 18 }}>Something went wrong</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24, maxWidth: 300 }}>
                {message}. This could be a connection issue or a server error.
            </p>
            {onRetry && (
                <Button variant="ghost" onClick={onRetry}>
                    🔄 Try Again
                </Button>
            )}
        </motion.div>
    );
}
