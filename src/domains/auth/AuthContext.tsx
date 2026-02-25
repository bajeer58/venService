/* ═══════════════════════════════════════════════════════════
   src/domains/auth/AuthContext.tsx — venService v2.0
   Domain-layer auth context. This is the canonical auth
   source of truth in the new DDD structure.
   
   NOTE: src/context/AuthContext.tsx remains as the entrypoint
   used by App.tsx. This file is the domain implementation
   to migrate toward. Re-exports from context/ for backward
   compatibility.
   ═══════════════════════════════════════════════════════════ */

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from 'react';
import type { User, UserRole } from '../../shared/types/domain';
import { emailToName, sleep } from '../../lib';

// ── Types ──────────────────────────────────────────────────

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AuthContextValue extends AuthState {
    login: (email: string, role: UserRole) => Promise<void>;
    logout: () => void;
    hasRole: (roles: UserRole[]) => boolean;
    clearError: () => void;
}

// ── Context ────────────────────────────────────────────────

const AuthDomainContext = createContext<AuthContextValue | null>(null);
AuthDomainContext.displayName = 'AuthDomainContext';

// ── Hook ───────────────────────────────────────────────────

export function useAuthDomain(): AuthContextValue {
    const ctx = useContext(AuthDomainContext);
    if (!ctx) throw new Error('useAuthDomain must be used within <AuthDomainProvider>');
    return ctx;
}

// ── Persistence ────────────────────────────────────────────

const STORAGE_KEY = 'venservice_user';

function loadUser(): User | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
}

function persistUser(user: User): void {
    // Store user object WITHOUT the access token for security
    const { accessToken: _, ...safeUser } = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser));
}

function clearPersistedUser(): void {
    localStorage.removeItem(STORAGE_KEY);
}

// ── Provider ───────────────────────────────────────────────

export const AuthDomainProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(loadUser);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hydration guard — ensure persisted user is still valid on mount
    useEffect(() => {
        const persisted = loadUser();
        if (persisted) setUser(persisted);
    }, []);

    const login = useCallback(async (email: string, role: UserRole): Promise<void> => {
        setIsLoading(true);
        setError(null);
        try {
            // Simulate API latency — replace with real fetch:
            // const res = await fetch('/api/v1/auth/login', { method: 'POST', body: JSON.stringify({ email, role }) });
            await sleep(600);

            if (!email.includes('@')) throw new Error('Invalid email address.');

            const newUser: User = {
                id: crypto.randomUUID(),
                name: emailToName(email),
                email,
                role,
                accessToken: `mock-jwt-${role}-${Date.now()}`,
            };

            setUser(newUser);
            persistUser(newUser);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Login failed. Please try again.';
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setError(null);
        clearPersistedUser();
    }, []);

    const hasRole = useCallback(
        (roles: UserRole[]): boolean => !!user && roles.includes(user.role),
        [user],
    );

    const clearError = useCallback(() => setError(null), []);

    const value: AuthContextValue = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
        hasRole,
        clearError,
    };

    return (
        <AuthDomainContext.Provider value={value}>
            {children}
        </AuthDomainContext.Provider>
    );
};
