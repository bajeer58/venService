// src/features/announcements/hooks/useAnnouncements.ts
// ─────────────────────────────────────────────────────────────
// Master hook for the announcement system.
// Handles: fetching, filtering, sorting, dismiss, analytics.
// ─────────────────────────────────────────────────────────────

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback, useRef } from 'react';
import { announcementService } from './announcementService';
import type {
  Announcement,
  ActiveAnnouncement,
  AnnouncementAnalyticsEvent,
  AnnouncementPriority,
} from './types';

// ── Constants ─────────────────────────────────────────────────

const QUERY_KEY = (tenantId?: string) => ['announcements', 'active', tenantId];
const DISMISS_STORAGE_KEY = 'venservice:dismissed_announcements';
const PRIORITY_ORDER: Record<AnnouncementPriority, number> = {
  urgent: 0,
  important: 1,
  normal: 2,
};

// ── Dismiss persistence ───────────────────────────────────────

function getDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISS_STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveDismissed(ids: Set<string>): void {
  try {
    localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify([...ids]));
  } catch { /* quota exceeded — fail silently */ }
}

// ── Active filter ─────────────────────────────────────────────

function isActive(announcement: Announcement): boolean {
  const now = Date.now();
  return (
    new Date(announcement.startDate).getTime() <= now &&
    new Date(announcement.expiryDate).getTime() > now
  );
}

function enrich(a: Announcement): ActiveAnnouncement {
  const expiresIn = new Date(a.expiryDate).getTime() - Date.now();
  return {
    ...a,
    isActive: isActive(a),
    isExpiringSoon: expiresIn > 0 && expiresIn < 24 * 60 * 60 * 1000,
  };
}

// ── Sort ──────────────────────────────────────────────────────

function sortAnnouncements(items: ActiveAnnouncement[]): ActiveAnnouncement[] {
  return [...items].sort((a, b) => {
    // Pinned first
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    // Then by priority
    const pa = PRIORITY_ORDER[a.priority];
    const pb = PRIORITY_ORDER[b.priority];
    if (pa !== pb) return pa - pb;
    // Then by newest
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

// ── Hook ──────────────────────────────────────────────────────

interface UseAnnouncementsOptions {
  tenantId?: string;
  enabled?: boolean;
}

export function useAnnouncements(options: UseAnnouncementsOptions = {}) {
  const { tenantId, enabled = true } = options;
  const qc = useQueryClient();
  const viewedRef = useRef(new Set<string>());

  const { data: raw, isLoading, isError, error, refetch } = useQuery({
    queryKey: QUERY_KEY(tenantId),
    queryFn: () => announcementService.getActive(tenantId),
    enabled,
    staleTime: 2 * 60 * 1000,   // 2 min — announcements don't change every second
    gcTime: 10 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Poll every 5 min as fallback
    retry: (count: number, err: unknown) => {
      const e = err as { status?: number };
      if (e?.status != null && e.status >= 400 && e.status < 500) return false;
      return count < 3;
    },
  });

  // Filter, enrich, sort, remove dismissed
  const announcements = useMemo<ActiveAnnouncement[]>(() => {
    if (!raw) return [];
    const dismissed = getDismissed();
    return sortAnnouncements(
      raw
        .filter((a: Announcement) => isActive(a) && !dismissed.has(a.id))
        .map(enrich)
    );
  }, [raw]);

  // ── Analytics ───────────────────────────────────────────────

  const trackEvent = useCallback((
    event: AnnouncementAnalyticsEvent,
    announcement: ActiveAnnouncement,
    extra?: { slideIndex?: number }
  ) => {
    announcementService.trackEvent({
      event,
      announcementId: announcement.id,
      priority: announcement.priority,
      tenantId: announcement.tenantId,
      timestamp: new Date().toISOString(),
      ...extra,
    });
  }, []);

  const trackView = useCallback((announcement: ActiveAnnouncement, slideIndex: number) => {
    // Only fire once per announcement per session
    if (viewedRef.current.has(announcement.id)) return;
    viewedRef.current.add(announcement.id);
    trackEvent('announcement_view', announcement, { slideIndex });
  }, [trackEvent]);

  const trackClick = useCallback((announcement: ActiveAnnouncement) => {
    trackEvent('announcement_click', announcement);
  }, [trackEvent]);

  // ── Dismiss ─────────────────────────────────────────────────

  const dismiss = useCallback((id: string) => {
    const dismissed = getDismissed();
    dismissed.add(id);
    saveDismissed(dismissed);

    const announcement = announcements.find(a => a.id === id);
    if (announcement) trackEvent('announcement_dismiss', announcement);

    // Optimistically update cache
    qc.setQueryData<Announcement[]>(QUERY_KEY(tenantId), (prev: Announcement[] | undefined) =>
      prev?.filter((a: Announcement) => a.id !== id) ?? []
    );
  }, [announcements, qc, tenantId, trackEvent]);

  // ── WebSocket real-time updates ──────────────────────────────
  // Uncomment when backend WebSocket is ready
  // useEffect(() => {
  //   return announcementService.subscribeToUpdates((fresh) => {
  //     qc.setQueryData(QUERY_KEY(tenantId), fresh);
  //   }, tenantId);
  // }, [tenantId, qc]);

  return {
    announcements,
    isLoading,
    isError,
    error: error ? (error as Error).message : null,
    refetch,
    dismiss,
    trackView,
    trackClick,
    hasAnnouncements: announcements.length > 0,
  };
}
