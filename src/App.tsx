/* ─────────────────────────────────────────────
   App root — React Router setup with layouts.
   ───────────────────────────────────────────── */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import VerifyPage from './pages/VerifyPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <BookingProvider>
            <AnimatePresence mode="wait">
              <Routes>
                {/* Public pages with navbar + footer */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/booking" element={<BookingPage />} />
                  <Route path="/verify" element={<VerifyPage />} />
                </Route>

                {/* Dashboard pages - Protected for Staff and Admin */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'staff']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/admin" element={<AdminDashboardPage />} />
                </Route>

                {/* Specific Driver protected route (Example) */}
                <Route
                  path="/driver"
                  element={
                    <ProtectedRoute allowedRoles={['driver']}>
                      <div className="p-10 text-white">Driver Dashboard coming soon...</div>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </AnimatePresence>
          </BookingProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
