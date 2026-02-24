/* ─────────────────────────────────────────────
   App root — React Router setup with layouts.
   ───────────────────────────────────────────── */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider } from './context/ToastContext';

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

              {/* Dashboard pages with sidebar */}
              <Route element={<DashboardLayout />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </BookingProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
