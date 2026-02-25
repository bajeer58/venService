// src/features/announcements/index.ts
// ─────────────────────────────────────────────────────────────
// Public API for the announcements feature.
// Import ONLY from this file — never from deep paths.
// This enforces encapsulation across teams.
// ─────────────────────────────────────────────────────────────

export { AnnouncementHero } from './components/AnnouncementHero';
export { useAnnouncements } from './hooks/useAnnouncements';
export { announcementService } from './services/announcementService';
export type {
  Announcement,
  ActiveAnnouncement,
  AnnouncementPriority,
  AnnouncementState,
  AnnouncementAnalyticsEvent,
  AnnouncementAnalyticsPayload,
} from './types';
export { PRIORITY_CONFIG } from './types';
