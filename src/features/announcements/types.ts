// src/features/announcements/types.ts
// ─────────────────────────────────────────────────────────────
// Domain model for the announcement system.
// ─────────────────────────────────────────────────────────────

export type AnnouncementPriority = 'urgent' | 'important' | 'normal';
export type AnnouncementAnalyticsEvent =
    | 'announcement_view'
    | 'announcement_click'
    | 'announcement_dismiss';

export interface Announcement {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription?: string;
    imageUrl: string;
    priority: AnnouncementPriority;
    startDate: string;   // ISO
    expiryDate: string;   // ISO
    isPinned: boolean;
    ctaLabel?: string;
    ctaUrl?: string;
    tenantId?: string;
    createdAt: string;
    updatedAt: string;
}

/** Enriched announcement used in the UI layer */
export interface ActiveAnnouncement extends Announcement {
    isActive: boolean;
    isExpiringSoon: boolean;
}

/** For the useAnnouncements hook return */
export interface AnnouncementState {
    announcements: ActiveAnnouncement[];
    isLoading: boolean;
    isError: boolean;
    hasAnnouncements: boolean;
}

export interface AnnouncementAnalyticsPayload {
    event: AnnouncementAnalyticsEvent;
    announcementId: string;
    priority: AnnouncementPriority;
    tenantId?: string;
    timestamp: string;
    slideIndex?: number;
}

// ── Priority config (shared by Hero + Badge) ──────────────────

interface PriorityConfig {
    label: string;
    badgeClass: string;
    accentColor: string;
    pulse: boolean;
}

export const PRIORITY_CONFIG: Record<AnnouncementPriority, PriorityConfig> = {
    urgent: {
        label: 'Urgent',
        badgeClass: 'bg-red-500/20 text-red-300 border-red-500/30',
        accentColor: '#ef4444',
        pulse: true,
    },
    important: {
        label: 'Important',
        badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        accentColor: '#f59e0b',
        pulse: false,
    },
    normal: {
        label: 'Announcement',
        badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        accentColor: '#3b82f6',
        pulse: false,
    },
};
