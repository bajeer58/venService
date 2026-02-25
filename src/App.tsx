/* ═══════════════════════════════════════════════════════════
   App.tsx — venService v2.0
   Provider tree + centralised routing via src/app/router.tsx
   ═══════════════════════════════════════════════════════════ */

import { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ── Legacy contexts (stable, used by existing pages) ──────
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { BookingProvider } from './context/BookingContext';

// ── Domain-layer providers (new architecture) ─────────────
import { BookingDomainProvider } from './domains/booking/BookingContext';

// ── Centralised route manifest ────────────────────────────
import { routes } from './app/router';

import Spinner from './components/ui/Spinner';
import DevToolbar from './dev/DevToolbar';

// ── Page-level loading fallback ───────────────────────────
function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
    >
      <Spinner size={32} label="Loading page…" />
    </div>
  );
}

// ── Route renderer (must be inside BrowserRouter) ─────────
function AppRoutes() {
  const element = useRoutes(routes);
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        {element}
      </Suspense>
    </AnimatePresence>
  );
}

// ── Singleton QueryClient (created once, not on every render) ─
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,   // 2 min
      retry: 1,
    },
  },
});

// ── App ───────────────────────────────────────────────────
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Legacy auth — consumed by all existing pages */}
        <AuthProvider>
          <ToastProvider>
            {/* Legacy booking — used by existing BookingFlowPage */}
            <BookingProvider>
              {/* Domain booking — used by src/domains/booking/* */}
              <BookingDomainProvider>

                <AppRoutes />

                {/* Dev-only RBAC toolbar — tree-shaken in production */}
                <DevToolbar />

                {/* Global toast notification layer */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'var(--surface3)',
                      color: 'var(--text)',
                      border: '1px solid var(--border-strong)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontFamily: 'var(--font-body)',
                      boxShadow: 'var(--shadow-lg)',
                    },
                    success: {
                      iconTheme: { primary: 'var(--color-success)', secondary: 'var(--bg)' },
                    },
                    error: {
                      iconTheme: { primary: 'var(--color-danger)', secondary: 'var(--bg)' },
                    },
                  }}
                />

              </BookingDomainProvider>
            </BookingProvider>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}