// src/shared/utils/cn.ts — className merge utility
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely — handles conditional, array, and conflict resolution */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─────────────────────────────────────────────────────────────

// src/lib/queryClient.ts — TanStack Query global config
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 60s for most data, override per-query for real-time needs
      staleTime:          60 * 1000,
      gcTime:             5 * 60 * 1000,
      retry:              (failureCount, error: any) => {
        // Don't retry 4xx errors (auth failures, validation)
        if (error?.status >= 400 && error?.status < 500) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

// ─────────────────────────────────────────────────────────────

// src/lib/featureFlags.ts
// ─────────────────────────────────────────────────────────────
// Feature flag system — LaunchDarkly-compatible interface.
// Swap the implementation without changing call sites.
// ─────────────────────────────────────────────────────────────

export type FlagKey =
  | 'booking_v2_flow'
  | 'dashboard_recharts_v2'
  | 'payment_bank_transfer'
  | 'qr_checkin'
  | 'multi_tenant_theming'
  | 'new_van_categories';

// In production: replace with LaunchDarkly SDK or your flag service
// const ldClient = LDClient.initialize(...)

const flags: Record<FlagKey, boolean> = {
  booking_v2_flow:          true,
  dashboard_recharts_v2:    true,
  payment_bank_transfer:    false,  // Gradual rollout
  qr_checkin:               true,
  multi_tenant_theming:     false,
  new_van_categories:       false,
};

export const featureFlags = {
  isEnabled: (key: FlagKey): boolean => {
    // In production: return ldClient.variation(key, false)
    return flags[key] ?? false;
  },

  // For A/B testing: pass user context
  isEnabledForUser: (key: FlagKey, _userId: string): boolean => {
    // In production: ldClient.variation(key, false, { key: userId })
    return flags[key] ?? false;
  },
};

// React hook
import { useMemo } from 'react';

export function useFeatureFlag(key: FlagKey): boolean {
  return useMemo(() => featureFlags.isEnabled(key), [key]);
}

// ─────────────────────────────────────────────────────────────

// src/lib/api.ts — typed API client with auth header injection
// ─────────────────────────────────────────────────────────────

import { tokenStore } from '../domains/auth/AuthContext';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildHeaders(skipAuth = false): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (!skipAuth) {
      const token = tokenStore.get();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    // CSRF token for mutations
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf_token='))
      ?.split('=')[1];
    if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

    return headers;
  }

  async get<T>(path: string, options?: FetchOptions): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      credentials: 'include',
      headers: this.buildHeaders(options?.skipAuth),
      ...options,
    });
    if (!res.ok) await this.handleError(res);
    return res.json();
  }

  async post<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      credentials: 'include',
      headers: this.buildHeaders(options?.skipAuth),
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
    if (!res.ok) await this.handleError(res);
    return res.json();
  }

  async patch<T>(path: string, body?: unknown, options?: FetchOptions): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: this.buildHeaders(options?.skipAuth),
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
    if (!res.ok) await this.handleError(res);
    return res.json();
  }

  private async handleError(res: Response): Promise<never> {
    let message = `API error ${res.status}`;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch { /* no-op */ }
    const err: any = new Error(message);
    err.status = res.status;
    throw err;
  }
}

export const api = new ApiClient(import.meta.env.VITE_API_BASE_URL ?? '/api');
