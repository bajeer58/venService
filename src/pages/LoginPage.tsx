/* ═══════════════════════════════════════════════════════════
   LoginPage.tsx — venService v2.0
   Role-based login portal: Passenger / Staff / Admin / Driver
   ═══════════════════════════════════════════════════════════ */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

// ── Demo credentials per role ──────────────────────────────────

interface RoleCard {
    role: UserRole;
    label: string;
    email: string;
    password: string;    // for display — mock only
    icon: string;
    color: string;
    dest: string;
    description: string;
}

const ROLE_CARDS: RoleCard[] = [
    {
        role: 'passenger',
        label: 'Passenger',
        email: 'passenger@venservice.pk',
        password: 'pass123',
        icon: '🧑‍💼',
        color: 'var(--color-primary)',
        dest: '/booking',
        description: 'Book seats, view tickets, track your journey.',
    },
    {
        role: 'staff',
        label: 'Staff / Ticketing',
        email: 'staff@venservice.pk',
        password: 'staff123',
        icon: '🎫',
        color: '#8b5cf6',
        dest: '/admin',
        description: 'Issue tickets, manage manifests, verify passengers.',
    },
    {
        role: 'admin',
        label: 'Administrator',
        email: 'admin@venservice.pk',
        password: 'admin123',
        icon: '🛡️',
        color: '#10b981',
        dest: '/admin',
        description: 'Full access: analytics, revenue, staff + routes management.',
    },
    {
        role: 'driver',
        label: 'Driver',
        email: 'driver@venservice.pk',
        password: 'driver123',
        icon: '🚐',
        color: '#f59e0b',
        dest: '/driver',
        description: 'View assigned trips, passenger list, scan QR tickets.',
    },
];

// ── Component ──────────────────────────────────────────────────

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading } = useAuth();

    const [selected, setSelected] = useState<UserRole | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Pick where to go after login
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

    function handleCardClick(card: RoleCard) {
        setSelected(card.role);
        setEmail(card.email);
        setPassword(card.password);
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        if (!selected) { toast.error('Please choose a portal above'); return; }
        if (!email.trim()) { toast.error('Email is required'); return; }

        setSubmitting(true);
        try {
            await login(email.trim(), selected);
            const card = ROLE_CARDS.find(c => c.role === selected)!;
            toast.success(`Welcome! Logged in as ${card.label}`);
            navigate(from ?? card.dest, { replace: true });
        } catch {
            toast.error('Login failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const selectedCard = ROLE_CARDS.find(c => c.role === selected);
    const busy = submitting || isLoading;

    return (
        <div className="login-page">
            {/* Background orbs */}
            <div className="login-page__orb login-page__orb--1" aria-hidden="true" />
            <div className="login-page__orb login-page__orb--2" aria-hidden="true" />

            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Header */}
                <div className="login-card__header">
                    <div className="logo" style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
                        Ven<span>Service</span>
                    </div>
                    <h1 className="login-card__title">Sign In to Your Portal</h1>
                    <p className="login-card__sub">Choose your role, then sign in</p>
                </div>

                {/* Role selector grid */}
                <div className="login-roles" role="radiogroup" aria-label="Select your portal role">
                    {ROLE_CARDS.map((card, i) => {
                        const isActive = selected === card.role;
                        return (
                            <motion.button
                                key={card.role}
                                role="radio"
                                aria-checked={isActive}
                                className={`login-role-card ${isActive ? 'active' : ''}`}
                                style={{ '--role-color': card.color } as React.CSSProperties}
                                onClick={() => handleCardClick(card)}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                whileHover={{ y: -3 }}
                            >
                                <span className="login-role-card__icon">{card.icon}</span>
                                <span className="login-role-card__label">{card.label}</span>
                                <span className="login-role-card__desc">{card.description}</span>
                                {isActive && (
                                    <motion.span
                                        className="login-role-card__badge"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                    >
                                        ✓
                                    </motion.span>
                                )}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Login form */}
                <form className="login-form" onSubmit={handleLogin} noValidate>
                    <div className="login-form__group">
                        <label htmlFor="login-email" className="input-label">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            className="login-form__input"
                            placeholder="you@venservice.pk"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            autoComplete="email"
                            disabled={busy}
                            aria-required="true"
                        />
                    </div>
                    <div className="login-form__group">
                        <label htmlFor="login-password" className="input-label">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            className="login-form__input"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="current-password"
                            disabled={busy}
                        />
                        <span className="input-hint">
                            Demo: select a portal above to auto-fill credentials
                        </span>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={busy}
                        aria-busy={busy}
                        style={{
                            width: '100%',
                            marginTop: 'var(--space-2)',
                            background: selectedCard?.color ?? 'var(--color-primary)',
                            borderColor: selectedCard?.color ?? 'var(--color-primary)',
                        }}
                    >
                        {busy ? (
                            <>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.7s linear infinite' }}>
                                    <path d="M21 12a9 9 0 00-9-9" />
                                </svg>
                                Signing in…
                            </>
                        ) : (
                            `Sign in as ${selectedCard?.label ?? 'Guest'} ${selectedCard?.icon ?? ''}`
                        )}
                    </button>
                </form>

                <p className="login-card__footer-note">
                    This is a demo app — no real data is stored.<br />
                    All credentials are pre-filled when you select a portal.
                </p>
            </motion.div>
        </div>
    );
}
