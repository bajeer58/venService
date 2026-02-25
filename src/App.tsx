/* ═══════════════════════════════════════════════════════════
   App.tsx — venService v2.0
   Lazy-loaded routes. One concern: routing only.
   ═══════════════════════════════════════════════════════════ */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { BookingProvider } from './context/BookingContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Spinner from './components/ui/Spinner';
import DevToolbar from './dev/DevToolbar';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// ── Lazy-load ALL pages — zero initial bundle cost ───────────
const HomePage = lazy(() => import('./pages/HomePage'));
const BookingFlowPage = lazy(() => import('./features/booking/BookingFlowPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const DriverDashboardPage = lazy(() => import('./pages/DriverDashboardPage'));
const VerifyPage = lazy(() => import('./pages/VerifyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// ── Page-level loading fallback ───────────────────────────────
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

// ── App ───────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <BookingProvider>
            <AnimatePresence mode="wait">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* ── Public routes ──────────────────── */}
                  <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/booking" element={<BookingFlowPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/verify" element={<VerifyPage />} />
                  </Route>

                  {/* ── Admin / Staff protected ────────── */}
                  <Route element={
                    <ProtectedRoute allowedRoles={['admin', 'staff']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                  </Route>

                  {/* ── Driver protected ───────────────── */}
                  <Route element={
                    <ProtectedRoute allowedRoles={['driver']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route path="/driver" element={<DriverDashboardPage />} />
                  </Route>

                  {/* ── 404 ────────────────────────────── */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </AnimatePresence>

            {/* Dev-only RBAC toolbar — no-op in production */}
            <DevToolbar />

            {/* react-hot-toast — global notification layer */}
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
          </BookingProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}