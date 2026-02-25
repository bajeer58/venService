/* ═══════════════════════════════════════════════════════════
   DevToolbar.tsx — venService v2.0
   DEV-ONLY RBAC login switcher.
   Renders nothing in production (import.meta.env.PROD).
   ═══════════════════════════════════════════════════════════ */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';

const ROLES: { label: string; role: UserRole; color: string }[] = [
    { label: 'Passenger', role: 'passenger', color: '#6b7394' },
    { label: 'Staff', role: 'staff', color: '#3d87fc' },
    { label: 'Admin', role: 'admin', color: '#10b981' },
    { label: 'Driver', role: 'driver', color: '#f59e0b' },
];

const DevToolbar: React.FC = () => {
    const { user, login, logout } = useAuth();
    const [open, setOpen] = useState(false);

    // Render nothing in production
    if (import.meta.env.PROD) return null;

    return (
        <div
            role="complementary"
            aria-label="Developer tools"
            style={{
                position: 'fixed',
                bottom: 24,
                left: 24,
                zIndex: 9999,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
            }}
        >
            <button
                onClick={() => setOpen(o => !o)}
                title="Dev RBAC Switcher"
                aria-expanded={open}
                style={{
                    background: '#0f0',
                    color: '#000',
                    border: 'none',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 12px rgba(0,255,0,0.4)',
                }}
            >
                🔧
            </button>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: 40,
                        left: 0,
                        background: 'rgba(6,8,15,0.96)',
                        border: '1px solid rgba(0,255,0,0.3)',
                        borderRadius: 8,
                        padding: 12,
                        minWidth: 200,
                        backdropFilter: 'blur(16px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 6,
                    }}
                >
                    <div style={{ color: '#00ff00', fontWeight: 700, marginBottom: 4, fontSize: 10, letterSpacing: '0.1em' }}>
                        ⚡ DEV: RBAC LOGIN
                    </div>

                    {ROLES.map(({ label, role, color }) => (
                        <button
                            key={role}
                            onClick={() => login(`${role}@dev.test`, role)}
                            style={{
                                background: user?.role === role ? `${color}22` : 'rgba(255,255,255,0.04)',
                                color: user?.role === role ? color : '#aaa',
                                border: `1px solid ${user?.role === role ? color : 'transparent'}`,
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontWeight: 600,
                                textAlign: 'left',
                                transition: 'all 0.15s',
                            }}
                        >
                            {user?.role === role ? '● ' : '○ '}{label}
                        </button>
                    ))}

                    {user && (
                        <button
                            onClick={logout}
                            style={{
                                marginTop: 4,
                                background: 'rgba(239,68,68,0.1)',
                                color: '#f87171',
                                border: '1px solid rgba(239,68,68,0.2)',
                                borderRadius: 6,
                                padding: '6px 10px',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                fontWeight: 600,
                            }}
                        >
                            ✕ Logout ({user.role})
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default DevToolbar;
