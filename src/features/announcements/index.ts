// src/features/announcements/index.ts
// ─────────────────────────────────────────────────────────────
// Public API for the announcements feature.
// Import ONLY from this file — never from deep paths.
// ─────────────────────────────────────────────────────────────

export { AnnouncementHero } from './AnnouncementHero';
export { useAnnouncements } from './useAnnouncements';
export { announcementService } from './announcementService';
export type {
  Announcement,
  ActiveAnnouncement,
  AnnouncementPriority,
  AnnouncementState,
  AnnouncementAnalyticsEvent,
  AnnouncementAnalyticsPayload,
} from './types';
export { PRIORITY_CONFIG } from './types';
