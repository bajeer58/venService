// ─────────────────────────────────────────────────────────────
// INTEGRATION GUIDE
// How to drop AnnouncementHero into your existing pages
// ─────────────────────────────────────────────────────────────

// ── 1. In your HomePage or Dashboard ─────────────────────────
//
// import { AnnouncementHero } from '@/features/announcements';
//
// export function HomePage() {
//   return (
//     <MainLayout>
//       {/* Replace empty hero div with: */}
//       <AnnouncementHero tenantId="venservice-pk" autoPlayMs={5000} />
//
//       {/* rest of page... */}
//       <ServicesSection />
//     </MainLayout>
//   );
// }

// ── 2. Wrap your app with QueryClientProvider (if not already) ─
//
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// const queryClient = new QueryClient();
//
// <QueryClientProvider client={queryClient}>
//   <App />
// </QueryClientProvider>

// ── 3. Environment variable ───────────────────────────────────
//
// .env.local:
// VITE_API_BASE_URL=https://api.venservice.pk
// VITE_USE_MOCK=true   ← set false when backend is ready

// ── 4. Install dependencies ───────────────────────────────────
//
// npm install @tanstack/react-query framer-motion

// ── 5. Folder placement ───────────────────────────────────────
//
// src/features/announcements/
// ├── index.ts                          ← public API
// ├── types/index.ts                    ← domain model
// ├── services/announcementService.ts   ← API layer
// ├── hooks/useAnnouncements.ts         ← data + logic
// └── components/AnnouncementHero.tsx   ← all UI components


// ── FULL WORKING DEMO PAGE ────────────────────────────────────

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnnouncementHero } from './AnnouncementHero';


const queryClient = new QueryClient();

export function AnnouncementDemoPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-950">
        {/* Nav (matches your existing dark nav) */}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <span className="text-white font-bold text-lg">
            Ven<span className="text-blue-500">Service</span>
            <span className="ml-2 text-xs border border-white/20 rounded-full px-2 py-0.5 text-white/40">BETA</span>
          </span>
          <div className="flex gap-6 text-sm text-white/60">
            <a href="/routes" className="hover:text-white transition-colors">Routes</a>
            <a href="/book" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-500 transition-colors">Book Seat</a>
            <a href="/features" className="hover:text-white transition-colors">Features</a>
          </div>
        </nav>

        {/* ← Hero goes here, replaces empty section */}
        <AnnouncementHero
          tenantId="venservice-pk"
          autoPlayMs={5000}
        />

        {/* Page continues below */}
        <div className="p-8 text-slate-600 text-sm text-center">
          Rest of page content...
        </div>
      </div>
    </QueryClientProvider>
  );
}
