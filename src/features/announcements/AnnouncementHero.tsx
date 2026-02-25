// src/features/announcements/components/AnnouncementHero.tsx
// ─────────────────────────────────────────────────────────────
// Production-grade Announcement Hero System
// Stripe / Linear / Notion quality UI
// ─────────────────────────────────────────────────────────────

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  memo,
  useId,
  type KeyboardEvent,
  type TouchEvent,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useAnnouncements } from './useAnnouncements';
import { PRIORITY_CONFIG } from './types';
import type { ActiveAnnouncement } from './types';

// ── Utility ───────────────────────────────────────────────────

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// ══════════════════════════════════════════════════════════════
// SKELETON LOADER
// ══════════════════════════════════════════════════════════════

function AnnouncementSkeleton() {
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: 480 }}
      aria-busy="true"
      aria-label="Loading announcements"
    >
      {/* Background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-10">
        <div className="max-w-2xl space-y-4">
          <div className="h-5 w-24 rounded-full bg-white/10 animate-pulse" />
          <div className="h-9 w-3/4 rounded-lg bg-white/10 animate-pulse" />
          <div className="h-5 w-full rounded bg-white/10 animate-pulse" />
          <div className="h-5 w-2/3 rounded bg-white/10 animate-pulse" />
          <div className="flex gap-3 mt-6">
            <div className="h-10 w-32 rounded-lg bg-white/10 animate-pulse" />
            <div className="h-10 w-24 rounded-lg bg-white/10 animate-pulse" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// EMPTY STATE
// ══════════════════════════════════════════════════════════════

function AnnouncementEmpty() {
  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: 480 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, #0f1729 0%, #060b16 100%)',
        }}
      />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10 text-center space-y-3">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-blue-400/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
          </svg>
        </div>
        <p className="text-slate-400 text-sm font-medium">No active announcements</p>
        <p className="text-slate-600 text-xs">Check back soon for updates</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// ERROR STATE
// ══════════════════════════════════════════════════════════════

function AnnouncementError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ height: 480 }}
    >
      <div className="absolute inset-0 bg-slate-950" />
      <div className="relative z-10 text-center space-y-4">
        <p className="text-slate-500 text-sm">Failed to load announcements</p>
        <button
          onClick={onRetry}
          className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PRIORITY BADGE
// ══════════════════════════════════════════════════════════════

function PriorityBadge({ priority }: { priority: ActiveAnnouncement['priority'] }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        'backdrop-blur-sm',
        config.badgeClass
      )}
    >
      {config.pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-400" />
        </span>
      )}
      {config.label}
    </span>
  );
}

// ══════════════════════════════════════════════════════════════
// ANNOUNCEMENT SLIDE (memoized)
// ══════════════════════════════════════════════════════════════

interface AnnouncementSlideProps {
  announcement: ActiveAnnouncement;
  onOpen: (a: ActiveAnnouncement) => void;
  onDismiss: (id: string) => void;
  direction: number;
}

const AnnouncementSlide = memo(function AnnouncementSlide({
  announcement,
  onOpen,
  onDismiss,
  direction,
}: AnnouncementSlideProps) {
  const shouldReduce = useReducedMotion();
  const config = PRIORITY_CONFIG[announcement.priority];

  const slideVariants = {
    enter: (d: number) => ({
      x: shouldReduce ? 0 : d > 0 ? '8%' : '-8%',
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({
      x: shouldReduce ? 0 : d > 0 ? '-8%' : '8%',
      opacity: 0,
    }),
  };

  return (
    <motion.div
      className="absolute inset-0"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: shouldReduce ? 0.1 : 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={announcement.imageUrl}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          loading="lazy"
          initial={{ scale: shouldReduce ? 1 : 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 6, ease: 'linear' }}
          style={{ willChange: 'transform' }}
        />
      </div>

      {/* Multi-layer gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to top, rgba(6,11,22,0.97) 0%, rgba(6,11,22,0.75) 40%, rgba(6,11,22,0.2) 100%),
            linear-gradient(to right, rgba(6,11,22,0.6) 0%, transparent 60%)
          `,
        }}
      />

      {/* Priority accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ background: `linear-gradient(to right, ${config.accentColor}80, transparent)` }}
      />

      {/* Urgent pulse border */}
      {announcement.priority === 'urgent' && (
        <motion.div
          className="absolute inset-0 border-2 border-red-500/30 pointer-events-none"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
        <div className="max-w-2xl">
          {/* Badge row */}
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <PriorityBadge priority={announcement.priority} />
            {announcement.isPinned && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Pinned
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h2
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3"
            style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif", letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.4 }}
          >
            {announcement.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-slate-300 text-sm md:text-base leading-relaxed mb-6 max-w-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {announcement.shortDescription}
          </motion.p>

          {/* Actions */}
          <motion.div
            className="flex items-center gap-3 flex-wrap"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.35 }}
          >
            <button
              onClick={() => onOpen(announcement)}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-semibold text-white',
                'transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                'shadow-lg',
              )}
              style={{
                background: `linear-gradient(135deg, ${config.accentColor}dd, ${config.accentColor}99)`,
                boxShadow: `0 4px 24px ${config.accentColor}40`,
              }}
            >
              {announcement.ctaLabel ?? 'Learn More'}
            </button>

            <button
              onClick={() => onOpen(announcement)}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:text-white border border-white/10 hover:border-white/25 backdrop-blur-sm transition-all duration-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              Details
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); onDismiss(announcement.id); }}
              className="ml-auto p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
              aria-label="Dismiss announcement"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
});

// ══════════════════════════════════════════════════════════════
// ANNOUNCEMENT MODAL
// ══════════════════════════════════════════════════════════════

interface AnnouncementModalProps {
  announcement: ActiveAnnouncement | null;
  onClose: () => void;
}

function AnnouncementModal({ announcement, onClose }: AnnouncementModalProps) {
  const dialogId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const shouldReduce = useReducedMotion();

  // Focus trap & keyboard
  useEffect(() => {
    if (!announcement) return;
    closeRef.current?.focus();

    const handleKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [announcement, onClose]);

  if (!announcement) return null;
  const config = PRIORITY_CONFIG[announcement.priority];

  return (
    <AnimatePresence>
      {announcement && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduce ? 0.1 : 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${dialogId}-title`}
              aria-describedby={`${dialogId}-desc`}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #0d1526 0%, #060b16 100%)' }}
              initial={{ scale: shouldReduce ? 1 : 0.94, y: shouldReduce ? 0 : 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: shouldReduce ? 1 : 0.96, y: shouldReduce ? 0 : 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={announcement.imageUrl}
                  alt={announcement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060b16] via-transparent to-transparent" />

                {/* Close button */}
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/70 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                  aria-label="Close"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={announcement.priority} />
                  {announcement.isExpiringSoon && (
                    <span className="text-xs text-amber-400/80 font-medium">Expires soon</span>
                  )}
                </div>

                <h3
                  id={`${dialogId}-title`}
                  className="text-xl font-bold text-white leading-snug"
                  style={{ fontFamily: "'Plus Jakarta Sans', 'DM Sans', sans-serif" }}
                >
                  {announcement.title}
                </h3>

                <p
                  id={`${dialogId}-desc`}
                  className="text-slate-400 text-sm leading-relaxed"
                >
                  {announcement.fullDescription ?? announcement.shortDescription}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 pt-1 text-xs text-slate-600">
                  <span>
                    Valid until{' '}
                    <span className="text-slate-500">
                      {new Date(announcement.expiryDate).toLocaleDateString('en-PK', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                  </span>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3 pt-2">
                  {announcement.ctaUrl && (
                    <a
                      href={announcement.ctaUrl}
                      className="flex-1 text-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                      style={{
                        background: `linear-gradient(135deg, ${config.accentColor}ee, ${config.accentColor}99)`,
                      }}
                    >
                      {announcement.ctaLabel ?? 'Learn More'}
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Priority accent bottom border */}
              <div
                className="h-px"
                style={{ background: `linear-gradient(to right, ${config.accentColor}60, transparent)` }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ══════════════════════════════════════════════════════════════
// SLIDE DOTS
// ══════════════════════════════════════════════════════════════

function SlideDots({
  count,
  active,
  onSelect,
}: {
  count: number;
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2" role="tablist" aria-label="Announcement slides">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          role="tab"
          aria-selected={i === active}
          aria-label={`Slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className={cn(
            'transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
            i === active
              ? 'w-6 h-1.5 bg-white'
              : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
          )}
        />
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN HERO COMPONENT
// ══════════════════════════════════════════════════════════════

interface AnnouncementHeroProps {
  tenantId?: string;
  autoPlayMs?: number;
  className?: string;
}

export function AnnouncementHero({
  tenantId,
  autoPlayMs = 5000,
  className,
}: AnnouncementHeroProps) {
  const {
    announcements,
    isLoading,
    isError,
    refetch,
    dismiss,
    trackView,
    trackClick,
    hasAnnouncements,
  } = useAnnouncements({ tenantId });

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [modalItem, setModalItem] = useState<ActiveAnnouncement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const heroRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const shouldReduce = useReducedMotion();

  // Clamp active index when announcements change
  useEffect(() => {
    if (activeIndex >= announcements.length && announcements.length > 0) {
      setActiveIndex(0);
    }
  }, [announcements.length, activeIndex]);

  // Track view on slide change
  useEffect(() => {
    const a = announcements[activeIndex];
    if (a) trackView(a, activeIndex);
  }, [activeIndex, announcements, trackView]);

  // Auto-play
  useEffect(() => {
    if (isPaused || !hasAnnouncements || announcements.length <= 1 || shouldReduce) return;

    intervalRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex(i => (i + 1) % announcements.length);
    }, autoPlayMs);

    return () => clearInterval(intervalRef.current);
  }, [isPaused, hasAnnouncements, announcements.length, autoPlayMs, shouldReduce]);

  // Navigation
  const goTo = useCallback((index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }, [activeIndex]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex(i => (i - 1 + announcements.length) % announcements.length);
  }, [announcements.length]);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex(i => (i + 1) % announcements.length);
  }, [announcements.length]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
  }, [goPrev, goNext]);

  // Touch swipe
  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) {
      delta > 0 ? goNext() : goPrev();
    }
  }, [goNext, goPrev]);

  // Open modal + analytics
  const handleOpen = useCallback((a: ActiveAnnouncement) => {
    setModalItem(a);
    trackClick(a);
  }, [trackClick]);

  // ── Render states ──────────────────────────────────────────

  if (isLoading) return <AnnouncementSkeleton />;
  if (isError) return <AnnouncementError onRetry={refetch} />;
  if (!hasAnnouncements) return <AnnouncementEmpty />;

  const current = announcements[activeIndex];

  return (
    <>
      {/* Hero */}
      <section
        ref={heroRef}
        className={cn('relative w-full overflow-hidden focus-visible:outline-none', className)}
        style={{ height: 480 }}
        role="region"
        aria-label="Announcements"
        aria-roledescription="carousel"
        aria-live="polite"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slides */}
        <AnimatePresence mode="wait" custom={direction}>
          <AnnouncementSlide
            key={current.id}
            announcement={current}
            onOpen={handleOpen}
            onDismiss={dismiss}
            direction={direction}
          />
        </AnimatePresence>

        {/* Navigation arrows — only if multiple slides */}
        {announcements.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 hover:border-white/25 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Previous announcement"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 hover:border-white/25 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="Next announcement"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Bottom controls bar */}
        <div className="absolute bottom-5 right-8 z-20 flex items-center gap-4">
          {/* Progress bar */}
          {!isPaused && announcements.length > 1 && !shouldReduce && (
            <div className="w-16 h-0.5 bg-white/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-white/50 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                key={`${current.id}-progress`}
                transition={{ duration: autoPlayMs / 1000, ease: 'linear' }}
              />
            </div>
          )}

          {/* Dots */}
          {announcements.length > 1 && (
            <SlideDots
              count={announcements.length}
              active={activeIndex}
              onSelect={goTo}
            />
          )}

          {/* Count */}
          <span className="text-xs text-white/30 font-mono tabular-nums">
            {activeIndex + 1}/{announcements.length}
          </span>
        </div>
      </section>

      {/* Modal */}
      <AnnouncementModal
        announcement={modalItem}
        onClose={() => setModalItem(null)}
      />
    </>
  );
}

export default AnnouncementHero;
