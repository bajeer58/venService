/* ═══════════════════════════════════════════════════════════
   NotFoundPage.tsx — venService v2.0
   ═══════════════════════════════════════════════════════════ */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 'var(--content-padding)',
                background: 'var(--bg)',
                gap: 'var(--space-6)',
            }}
        >
            <div style={{ fontSize: 80, lineHeight: 1 }} aria-hidden="true">🚐</div>

            <div>
                <div
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--color-primary)',
                        marginBottom: 'var(--space-3)',
                    }}
                >
                    404 — Not Found
                </div>
                <h1
                    style={{
                        fontFamily: 'var(--font-head)',
                        fontSize: 'var(--text-5xl)',
                        fontWeight: 800,
                        color: 'var(--text)',
                        margin: 0,
                    }}
                >
                    Wrong Stop
                </h1>
                <p style={{ color: 'var(--muted)', margin: 'var(--space-4) 0 0', maxWidth: 400 }}>
                    Looks like this route doesn't exist. The page you're looking for has departed or never existed.
                </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button variant="primary">← Back to Home</Button>
                </Link>
                <Link to="/booking" style={{ textDecoration: 'none' }}>
                    <Button variant="ghost">Book a Seat</Button>
                </Link>
            </div>
        </motion.div>
    );
}
