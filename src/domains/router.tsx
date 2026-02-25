// src/app/router.tsx
// ─────────────────────────────────────────────────────────────
// Route-level code splitting via React.lazy.
// Protected routes are enforced here (UX guard only).
// True auth is enforced server-side.
// ─────────────────────────────────────────────────────────────

import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../domains/auth/AuthContext';
import { Skeleton } from '../shared/components/atoms';
import type { UserRole } from '../shared/types/domain';

// ── Lazy-loaded pages ─────────────────────────────────────────
// Each route chunk is independent — dashboard chart bundle
// does NOT ship to customers on the booking flow.

const HomePage     = lazy(() => import('../domains/booking/pages/HomePage'));
const BookingPage  = lazy(() => import('../domains/booking/pages/BookingPage'));
const DashboardPage = lazy(() => import('../domains/dashboard/pages/DashboardPage'));
const ProfilePage  = lazy(() => import('../domains/auth/pages/ProfilePage'));
const LoginPage    = lazy(() => import('../domains/auth/pages/LoginPage'));
const NotFoundPage = lazy(() => import('../shared/components/pages/NotFoundPage'));

// ── Loading fallback ──────────────────────────────────────────

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-md px-4">
        <Skeleton variant="rectangular" height={200} />
        <Skeleton variant="rectangular" height={24} width="60%" />
        <Skeleton variant="rectangular" height={16} />
        <Skeleton variant="rectangular" height={16} width="80%" />
      </div>
    </div>
  );
}

// ── Protected Route ───────────────────────────────────────────

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // ⚠️ Client-side RBAC — UX only. Server enforces real permissions.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

// ── Router ────────────────────────────────────────────────────

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/"       element={<HomePage />} />
          <Route path="/login"  element={<LoginPage />} />

          {/* Authenticated — any role */}
          <Route path="/book" element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole={['admin', 'driver']}>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/*" element={
            <ProtectedRoute requiredRole="admin">
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
