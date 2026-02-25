// src/domains/auth/AuthContext.tsx
// ─────────────────────────────────────────────────────────────
// Auth domain — secure token handling architecture.
//
// SECURITY MODEL:
//   - Access token: in-memory only (never localStorage)
//   - Refresh token: HttpOnly cookie (set by server, not JS-accessible)
//   - CSRF token: read from meta tag, sent on every mutation
//   - Role-based routing: client-side ONLY as UX — API enforces real RBAC
// ─────────────────────────────────────────────────────────────

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type { AuthState, User, UserRole } from '../../shared/types/domain';

// ── In-memory token store (singleton, not React state) ────────
// Storing in React state would cause unnecessary re-renders AND
// expose the token via React DevTools. Use a module-level ref.

let _accessToken: string | null = null;

export const tokenStore = {
  get: () => _accessToken,
  set: (token: string) => { _accessToken = token; },
  clear: () => { _accessToken = null; },
};

// ── CSRF token ────────────────────────────────────────────────
// Server sets a non-HttpOnly cookie named `csrf_token`.
// JS reads it and sends it as a header (Double Submit Cookie pattern).

export function getCsrfToken(): string | null {
  const match = /(?:^|;\s*)csrf_token=([^;]*)/.exec(document.cookie);
  return match?.[1] ?? null;
}

// ── Auth Reducer ──────────────────────────────────────────────

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User; accessToken: string }
  | { type: 'LOGIN_FAILURE'; error: string }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_TOKEN'; user: User; accessToken: string }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user:            null,
  isAuthenticated: false,
  isLoading:       true,   // true until bootstrap check completes
  error:           null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      tokenStore.set(action.accessToken);
      return { user: action.user, isAuthenticated: true, isLoading: false, error: null };
    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false, error: action.error };
    case 'LOGOUT':
      tokenStore.clear();
      return { user: null, isAuthenticated: false, isLoading: false, error: null };
    case 'REFRESH_TOKEN':
      tokenStore.set(action.accessToken);
      return { ...state, user: action.user, isAuthenticated: true };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login:     (email: string, password: string) => Promise<void>;
  logout:    () => Promise<void>;
  clearError:() => void;
  hasRole:   (role: UserRole | UserRole[]) => boolean;
  hasAnyRole:(roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Bootstrap: attempt silent refresh on mount
  useEffect(() => {
    silentRefresh();
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  async function silentRefresh() {
    try {
      // Server reads HttpOnly refresh_token cookie automatically
      const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // sends HttpOnly cookies
        headers: { 'X-CSRF-Token': getCsrfToken() ?? '' },
      });
      if (!res.ok) throw new Error('Refresh failed');
      const { user, accessToken, expiresIn } = await res.json();
      dispatch({ type: 'REFRESH_TOKEN', user, accessToken });
      // Schedule next refresh 1 minute before expiry
      scheduleRefresh(expiresIn);
    } catch {
      dispatch({ type: 'LOGOUT' });
    }
  }

  function scheduleRefresh(expiresIn: number) {
    const delay = Math.max((expiresIn - 60) * 1000, 0);
    refreshTimerRef.current = setTimeout(silentRefresh, delay);
  }

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken() ?? '',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message ?? 'Login failed');
      }
      const { user, accessToken, expiresIn } = await res.json();
      dispatch({ type: 'LOGIN_SUCCESS', user, accessToken });
      scheduleRefresh(expiresIn);
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE', error: (err as Error).message });
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'X-CSRF-Token': getCsrfToken() ?? '' },
      });
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  /**
   * CLIENT-SIDE ROLE CHECK — UX ONLY.
   * ⚠️  This is NOT a security boundary.
   *     All protected operations MUST be enforced server-side.
   *     A user can manipulate React state to bypass these checks.
   */
  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!state.user) return false;
      const roles = Array.isArray(role) ? role : [role];
      return roles.includes(state.user.role);
    },
    [state.user]
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => hasRole(roles),
    [hasRole]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user:            state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading:       state.isLoading,
      error:           state.error,
      login,
      logout,
      clearError,
      hasRole,
      hasAnyRole,
    }),
    [state, login, logout, clearError, hasRole, hasAnyRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Hooks ─────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export function useRequireRole(role: UserRole | UserRole[]) {
  const { hasRole, isAuthenticated } = useAuth();
  return { authorized: isAuthenticated && hasRole(role) };
}
