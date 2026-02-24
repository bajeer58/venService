/* ─────────────────────────────────────────────
   Dashboard layout — wraps admin pages.
   No footer, includes sidebar via child pages.
   ───────────────────────────────────────────── */

import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Sidebar from '../components/navigation/Sidebar';
import BookingModal from '../components/seats/BookingModal';
import Toast from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';

export default function DashboardLayout() {
  const { user, hasRole } = useAuth();

  // Extra safety check (though ProtectedRoute should handle this)
  if (!user || !hasRole(['admin', 'staff', 'driver'])) {
    return <Navigate to="/" replace />;
  }

  // Determine if the user is a driver
  const isDriver = hasRole(['driver']);

  return (
    <div style={{ display: 'flex' }}>
      {/* Navbar is always present */}
      <Navbar />

      {/* Sidebar is only present for non-drivers */}
      {!isDriver && <Sidebar />}

      <div
        className="dashboard-container"
        style={{
          flex: 1,
          // Adjust margin based on whether sidebar is present
          marginLeft: isDriver ? '0' : 'var(--sidebar-offset, var(--sidebar-width))',
          minHeight: '100vh',
          background: 'var(--surface)',
          padding: '100px 40px 60px',
          maxWidth: '100%'
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Outlet />
        </div>
      </div>
      <BookingModal />
      <Toast />
    </div>
  );
}
