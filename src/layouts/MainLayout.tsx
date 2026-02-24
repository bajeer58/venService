/* ─────────────────────────────────────────────
   Main layout — wraps public pages.
   Includes Navbar, Footer, BookingModal, and Toast.
   ───────────────────────────────────────────── */

import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import BookingModal from '../components/seats/BookingModal';
import Toast from '../components/ui/Toast';

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BookingModal />
      <Toast />
    </>
  );
}
