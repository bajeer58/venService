/* ═══════════════════════════════════════════════════════════
   AuthContext.tsx — venService v2.0
   Context + hook + provider — all in one file.
   No more AuthContextInstance.ts split anti-pattern.
   ═══════════════════════════════════════════════════════════ */

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '../types';

// ── Interface ─────────────────────────────────────────────────

interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, role: UserRole) => Promise<void>;
    logout: () => void;
    hasRole: (roles: UserRole[]) => boolean;
}

// ── Context ───────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);
AuthContext.displayName = 'AuthContext';

// ── Hook ──────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}

// ── Provider ──────────────────────────────────────────────────

const STORAGE_KEY = 'venservice_user';

function loadPersistedUser(): User | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(loadPersistedUser);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(async (email: string, role: UserRole): Promise<void> => {
        setIsLoading(true);
        try {
            // Simulate network latency (replace with real API call)
            await new Promise(resolve => setTimeout(resolve, 600));

            const mockUser: User = {
                id: crypto.randomUUID(),
                name: email.split('@')[0]
                    .replace(/[._-]/g, ' ')
                    .replace(/\b\w/g, c => c.toUpperCase()),
                email,
                role,
                accessToken: `mock-jwt-${role}-${Date.now()}`,
            };

            setUser(mockUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const hasRole = useCallback((roles: UserRole[]): boolean => {
        if (!user) return false;
        return roles.includes(user.role);
    }, [user]);

    const value: AuthContextValue = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
