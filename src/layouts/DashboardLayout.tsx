/* ─────────────────────────────────────────────
   Dashboard layout — wraps admin pages.
   No footer, includes sidebar via child pages.
   ───────────────────────────────────────────── */

import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import BookingModal from '../components/seats/BookingModal';
import Toast from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';

export default function DashboardLayout() {
  const { user, hasRole } = useAuth();

  // Extra safety check (though ProtectedRoute should handle this)
  if (!user || !hasRole(['admin', 'staff'])) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container" style={{ minHeight: '100vh', background: 'var(--surface)' }}>
        <Outlet />
      </div>
      <BookingModal />
      <Toast />
    </>
  );
}
