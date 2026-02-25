// src/domains/dashboard/components/DashboardPage.tsx
// ─────────────────────────────────────────────────────────────
// Enterprise dashboard: KPIs, charts, bookings table.
// Recharts is wrapped in an abstraction layer so swapping
// chart libraries never cascades into page components.
// ─────────────────────────────────────────────────────────────

import { Suspense, lazy, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { KPICard, Badge, Card, Skeleton } from '../../../shared/components/atoms';
import type { Booking, DashboardStats, KPIMetric } from '../../../shared/types/domain';

// ── Chart Abstraction Layer ───────────────────────────────────
// Wrapping Recharts behind typed interfaces means:
//   1. Charts are testable without Recharts internals
//   2. Swapping to Victory/Chart.js = 0 feature changes
//   3. Theming is centralized here

interface RevenueChartProps {
  data: { date: string; revenue: number; count: number }[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return <Skeleton variant="rectangular" className="w-full h-64 rounded-xl" />;
  }
  return (
    <Card>
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">Revenue & Bookings</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0',
              fontSize: 12,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="revenue" name="Revenue (PKR)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="count"   name="Bookings"      fill="#e0f2fe" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

interface TrendLineProps {
  data: { date: string; value: number }[];
  label: string;
  color?: string;
  isLoading?: boolean;
}

export function TrendLine({ data, label, color = '#3b82f6', isLoading }: TrendLineProps) {
  if (isLoading) {
    return <Skeleton variant="rectangular" className="w-full h-48 rounded-xl" />;
  }
  return (
    <Card>
      <h3 className="text-sm font-semibold text-neutral-700 mb-4">{label}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e2e8f0', fontSize: 12 }} />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

// ── KPI Grid ──────────────────────────────────────────────────

interface KPIGridProps {
  metrics: KPIMetric[];
  isLoading?: boolean;
}

function KPIGrid({ metrics, isLoading }: KPIGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map(metric => (
        <KPICard key={metric.id} {...metric} isLoading={isLoading} />
      ))}
    </div>
  );
}

// ── Bookings Table ────────────────────────────────────────────
// For production: wrap with react-virtual for 10k+ rows.

interface BookingsTableProps {
  bookings: Booking[];
  isLoading?: boolean;
  onCheckin?:  (id: string) => void;
  onExportCSV?: () => void;
}

function BookingRow({ booking, onCheckin }: { booking: Booking; onCheckin?: (id: string) => void }) {
  return (
    <tr className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
      <td className="px-4 py-3 text-sm text-neutral-600 font-mono">{booking.id.slice(0, 8)}…</td>
      <td className="px-4 py-3 text-sm font-medium text-neutral-900">{booking.van.name}</td>
      <td className="px-4 py-3 text-sm text-neutral-600">
        {booking.dateRange.startDate} → {booking.dateRange.endDate}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-neutral-900">
        PKR {booking.totalAmount.toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <Badge variant={booking.status as any} withDot>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {booking.status === 'confirmed' && onCheckin && (
            <button
              onClick={() => onCheckin(booking.id)}
              className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-md transition-colors"
            >
              Check In
            </button>
          )}
          {booking.qrCode && (
            <button
              onClick={() => window.open(booking.qrCode, '_blank')}
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 px-2.5 py-1 rounded-md transition-colors"
              aria-label="View QR code"
            >
              QR
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

export function BookingsTable({ bookings, isLoading, onCheckin, onExportCSV }: BookingsTableProps) {
  return (
    <Card padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
        <h3 className="text-sm font-semibold text-neutral-700">Recent Bookings</h3>
        {onExportCSV && (
          <button
            onClick={onExportCSV}
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-md transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            Export CSV
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-100">
              {['ID', 'Van', 'Dates', 'Amount', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-neutral-100">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <Skeleton variant="text" height={14} width={`${60 + j * 10}%`} />
                    </td>
                  ))}
                </tr>
              ))
              : bookings.map(b => (
                <BookingRow key={b.id} booking={b} onCheckin={onCheckin} />
              ))
            }
          </tbody>
        </table>

        {!isLoading && bookings.length === 0 && (
          <div className="text-center py-16 text-neutral-400">
            <p className="text-sm">No bookings found</p>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── CSV Export Utility ────────────────────────────────────────

export function exportBookingsToCSV(bookings: Booking[]): void {
  const headers = ['ID', 'Van', 'Start Date', 'End Date', 'Days', 'Amount', 'Status', 'Payment'];
  const rows = bookings.map(b => [
    b.id,
    b.van.name,
    b.dateRange.startDate,
    b.dateRange.endDate,
    b.dateRange.days,
    b.totalAmount,
    b.status,
    b.paymentMethod,
  ]);

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Dashboard Page ────────────────────────────────────────────

interface DashboardPageProps {
  stats: DashboardStats | null;
  bookings: Booking[];
  isLoading: boolean;
  onCheckin:    (id: string) => void;
}

export function DashboardPage({ stats, bookings, isLoading, onCheckin }: DashboardPageProps) {
  const kpis = useMemo<KPIMetric[]>(() => [
    {
      id:    'total-bookings',
      label: 'Total Bookings',
      value: stats?.totalBookings ?? 0,
      delta: 12,
      trend: 'up',
      isLoading,
    },
    {
      id:    'active-bookings',
      label: 'Active Now',
      value: stats?.activeBookings ?? 0,
      delta: -3,
      trend: 'down',
      isLoading,
    },
    {
      id:    'revenue',
      label: 'Monthly Revenue',
      value: stats?.revenue.toLocaleString() ?? '0',
      unit:  'PKR',
      delta: 8,
      trend: 'up',
      isLoading,
    },
    {
      id:    'available-vans',
      label: 'Available Vans',
      value: stats?.availableVans ?? 0,
      trend: 'flat',
      isLoading,
    },
  ], [stats, isLoading]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-0.5">
            {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <KPIGrid metrics={kpis} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={stats?.bookingsByDay ?? []} isLoading={isLoading} />
        <TrendLine
          data={(stats?.bookingsByDay ?? []).map(d => ({ date: d.date, value: d.count }))}
          label="Booking Volume Trend"
          isLoading={isLoading}
        />
      </div>

      <BookingsTable
        bookings={bookings}
        isLoading={isLoading}
        onCheckin={onCheckin}
        onExportCSV={() => exportBookingsToCSV(bookings)}
      />
    </div>
  );
}
