/* ═══════════════════════════════════════════════════════════
   src/app/router.tsx — venService v2.0
   Centralised route manifest. Import this in App.tsx so
   routing logic lives in one place. Lazy-loads all pages.
   ═══════════════════════════════════════════════════════════ */

import { lazy } from 'react';
import { type RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import Spinner from '../components/ui/Spinner';


// ── Lazy page imports ──────────────────────────────────────
const HomePage = lazy(() => import('../pages/HomePage'));
const BookingFlowPage = lazy(() => import('../features/booking/BookingFlowPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const VerifyPage = lazy(() => import('../pages/VerifyPage'));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage'));
const DriverDashboardPage = lazy(() => import('../pages/DriverDashboardPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Re-export Spinner so App.tsx can use the same loading UI
export { Spinner };

// ── Route definitions ──────────────────────────────────────

/**
 * Public routes — accessible without authentication.
 */
export const publicRoutes: RouteObject[] = [
    {
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'booking', element: <BookingFlowPage /> },
            { path: 'login', element: <LoginPage /> },
            { path: 'verify', element: <VerifyPage /> },
        ],
    },
];

/**
 * Admin / Staff protected routes.
 */
export const adminRoutes: RouteObject[] = [
    {
        element: (
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: 'admin', element: <AdminDashboardPage /> },
        ],
    },
];

/**
 * Driver protected routes.
 */
export const driverRoutes: RouteObject[] = [
    {
        element: (
            <ProtectedRoute allowedRoles={['driver']}>
                <DashboardLayout />
            </ProtectedRoute>
        ),
        children: [
            { path: 'driver', element: <DriverDashboardPage /> },
        ],
    },
];

/**
 * 404 catch-all.
 */
export const catchAllRoute: RouteObject = {
    path: '*',
    element: <NotFoundPage />,
};

/**
 * Combined flat route manifest consumed by <Routes useRoutes={routes} />.
 */
export const routes: RouteObject[] = [
    ...publicRoutes,
    ...adminRoutes,
    ...driverRoutes,
    catchAllRoute,
];
