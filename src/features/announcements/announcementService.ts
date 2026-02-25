// src/features/announcements/services/announcementService.ts
// ─────────────────────────────────────────────────────────────
// API abstraction layer for announcements.
// All HTTP concerns live here — components never call fetch() directly.
// Designed for easy swap to WebSocket / SSE for real-time updates.
// ─────────────────────────────────────────────────────────────

import type { Announcement, AnnouncementAnalyticsPayload } from './types';


const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

// ── Retry utility with exponential backoff ────────────────────

async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retries = 3,
  backoff = 400
): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const err: any = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      // Don't retry 4xx — they won't change
      if (res.status >= 400 && res.status < 500) throw err;
      throw err;
    }
    return res;
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(resolve => setTimeout(resolve, backoff));
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}

// ── Mock data for development / when API unavailable ──────────

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title: 'New Karachi–Lahore Express Route Launched',
    shortDescription: 'Experience our premium air-conditioned coaches on the busiest corridor in Pakistan. Book now and get 20% off your first ride.',
    fullDescription: 'We are thrilled to announce the launch of our flagship Karachi–Lahore Express route. Featuring state-of-the-art coaches with reclining seats, onboard Wi-Fi, USB charging ports, and a dedicated hostess service. Departures every 2 hours from 6 AM to 10 PM. Early bird discount of 20% available for bookings made 48 hours in advance.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1400&q=80',
    priority: 'important',
    startDate: new Date(Date.now() - 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    isPinned: true,
    ctaLabel: 'Book Now',
    ctaUrl: '/book',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ann-002',
    title: 'Scheduled Maintenance — Dec 28, 2:00–4:00 AM',
    shortDescription: 'Our booking platform will be unavailable for 2 hours during scheduled maintenance. All existing bookings remain unaffected.',
    fullDescription: 'To improve platform reliability and deploy new features, we will be performing scheduled maintenance on December 28th from 2:00 AM to 4:00 AM PKT. The mobile app and web portal will be temporarily unavailable. Your existing bookings are safe and unaffected. We apologize for any inconvenience.',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
    priority: 'urgent',
    startDate: new Date(Date.now() - 3600000).toISOString(),
    expiryDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    isPinned: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ann-003',
    title: 'Winter Special: 15% Off All Intercity Routes',
    shortDescription: 'Celebrate the season with discounted fares across all intercity routes. Valid through January 15th.',
    fullDescription: 'Ring in the new year with our Winter Special promotion. Get 15% off all intercity bookings made before January 15th for travel through February 28th. Use code WINTER25 at checkout. Applicable to all seat classes including Premium and Business.',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=80',
    priority: 'normal',
    startDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    expiryDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    isPinned: false,
    ctaLabel: 'View Offer',
    ctaUrl: '/routes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ── Service ───────────────────────────────────────────────────

export const announcementService = {
  /**
   * Fetch active announcements for a tenant.
   * Falls back to mock data in development.
   */
  async getActive(tenantId?: string): Promise<Announcement[]> {
    // In development without backend: return mocks
    if (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK !== 'false') {
      await new Promise(r => setTimeout(r, 600)); // simulate latency
      return MOCK_ANNOUNCEMENTS;
    }

    const params = new URLSearchParams();
    if (tenantId) params.set('tenantId', tenantId);

    const res = await fetchWithRetry(
      `${BASE_URL}/announcements/active?${params}`,
      {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const json = await res.json();
    return json.data ?? json; // handle both { data: [] } and []
  },

  /**
   * Track analytics event — fire and forget, never block UI.
   */
  trackEvent(payload: AnnouncementAnalyticsPayload): void {
    // Fire-and-forget — never await this in UI code
    const send = async () => {
      try {
        await fetch(`${BASE_URL}/analytics/events`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          // Use keepalive so event survives page navigation
          keepalive: true,
        });
      } catch {
        // Silent fail — analytics must never break UX
      }
    };

    // Use sendBeacon for reliability on page unload
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        `${BASE_URL}/analytics/events`,
        JSON.stringify(payload)
      );
    } else {
      void send();
    }
  },

  /**
   * WebSocket connection for real-time updates.
   * Returns cleanup function.
   * Future: replace polling with this.
   */
  subscribeToUpdates(
    onUpdate: (announcements: Announcement[]) => void,
    tenantId?: string
  ): () => void {
    const wsUrl = import.meta.env.VITE_WS_URL;
    if (!wsUrl) return () => { };

    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let destroyed = false;

    const connect = () => {
      ws = new WebSocket(`${wsUrl}/announcements?tenantId=${tenantId ?? ''}`);

      ws.onmessage = (e) => {
        try {
          const { data } = JSON.parse(e.data);
          onUpdate(data);
        } catch { /* malformed message */ }
      };

      ws.onclose = () => {
        if (!destroyed) {
          reconnectTimer = setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      destroyed = true;
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  },
};
