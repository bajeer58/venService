/* ─────────────────────────────────────────────
   Dashboard layout — wraps admin pages.
   No footer, includes sidebar via child pages.
   ───────────────────────────────────────────── */

import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import BookingModal from '../components/seats/BookingModal';
import Toast from '../components/ui/Toast';

export default function DashboardLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <BookingModal />
      <Toast />
    </>
  );
}
