// src/domains/booking/hooks/useBookingQueries.ts
// ─────────────────────────────────────────────────────────────
// TanStack Query hooks for server state.
// Separates server state (React Query) from UI state (Context).
// ─────────────────────────────────────────────────────────────

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/index';
import { toast } from '../../../shared/components/molecules/Toast';
import type { Booking, Van, BookingDraft, DashboardStats } from '../../../shared/types/domain';

// ── Query Keys ────────────────────────────────────────────────
// Centralized key factory prevents typo bugs and enables targeted invalidation

export const queryKeys = {
  vans:     {
    all:       () => ['vans'] as const,
    available: () => ['vans', 'available'] as const,
    detail:    (id: string) => ['vans', id] as const,
  },
  bookings: {
    all:    () => ['bookings'] as const,
    list:   (params?: object) => ['bookings', 'list', params] as const,
    detail: (id: string) => ['bookings', id] as const,
    mine:   () => ['bookings', 'mine'] as const,
  },
  dashboard: {
    stats:   () => ['dashboard', 'stats'] as const,
  },
} as const;

// ── Van Queries ───────────────────────────────────────────────

export function useAvailableVans() {
  return useQuery({
    queryKey: queryKeys.vans.available(),
    queryFn:  () => api.get<{ data: Van[] }>('/vans?available=true').then(r => r.data),
    staleTime: 2 * 60 * 1000,
  });
}

// ── Booking Queries ───────────────────────────────────────────

export function useMyBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.mine(),
    queryFn:  () => api.get<{ data: Booking[] }>('/bookings/me').then(r => r.data),
  });
}

export function useAllBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.list(),
    queryFn:  () => api.get<{ data: Booking[] }>('/bookings').then(r => r.data),
    // Auto-refetch every 30s for dashboard real-time feel
    refetchInterval: 30_000,
  });
}

// ── Booking Mutations ─────────────────────────────────────────

export function useCreateBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (draft: BookingDraft) =>
      api.post<{ data: Booking }>('/bookings', draft).then(r => r.data),
    onSuccess: (booking) => {
      // Optimistically update both lists
      qc.invalidateQueries({ queryKey: queryKeys.bookings.all() });
      qc.invalidateQueries({ queryKey: queryKeys.vans.available() });
      toast.success('Booking confirmed!', `Your van is booked for ${booking.dateRange.days} days.`);
    },
    onError: (err: any) => {
      toast.error('Booking failed', err.message ?? 'Please try again.');
    },
  });
}

export function useCheckinBooking() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) =>
      api.patch<{ data: Booking }>(`/bookings/${bookingId}/checkin`).then(r => r.data),
    onSuccess: (booking) => {
      qc.setQueryData<Booking[]>(queryKeys.bookings.list(), prev =>
        prev?.map(b => b.id === booking.id ? booking : b) ?? []
      );
      toast.success('Checked in', `Booking ${booking.id.slice(0, 8)} is now active.`);
    },
    onError: (err: any) => {
      toast.error('Check-in failed', err.message);
    },
  });
}

// ── Dashboard Queries ─────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(),
    queryFn:  () => api.get<{ data: DashboardStats }>('/dashboard/stats').then(r => r.data),
    refetchInterval: 60_000,
  });
}
