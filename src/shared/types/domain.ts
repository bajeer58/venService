/* ═══════════════════════════════════════════════════════════
   src/shared/types/domain.ts — venService v2.0
   Shared domain-level TypeScript interfaces and types.
   These are the canonical type definitions used across all
   domain modules (auth, booking, dashboard).
   ═══════════════════════════════════════════════════════════ */

// ── User & Auth ────────────────────────────────────────────

export type UserRole = 'passenger' | 'staff' | 'admin' | 'driver';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
    accessToken?: string;
}

// ── Route / Service ────────────────────────────────────────

export interface ServiceRoute {
    id: string;
    name: string;
    origin: string;
    destination: string;
    distance: number;     // km
    duration: number;     // minutes
    basePrice: number;     // PKR
    amenities: string[];
    imageUrl?: string;
    isPopular?: boolean;
}

// ── Schedule / Seat ────────────────────────────────────────

export interface Schedule {
    id: string;
    routeId: string;
    departureAt: string;   // ISO 8601
    arrivalAt: string;   // ISO 8601
    totalSeats: number;
    bookedSeats: number;
    vehicleType: 'bus' | 'van' | 'premier';
}

export type SeatStatus = 'available' | 'selected' | 'booked' | 'disabled';

export interface Seat {
    id: string;
    number: string;
    status: SeatStatus;
    price?: number;  // override from base
}

// ── Passenger ──────────────────────────────────────────────

export interface PassengerDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    cnicLast4?: string;
}

// ── Payment ────────────────────────────────────────────────

export type PaymentMethod = 'card' | 'easypaisa' | 'jazzcash' | 'cash';

export interface PaymentDetails {
    method: PaymentMethod;
    cardNumber?: string;   // masked after validation
    cardName?: string;
    expiry?: string;   // MM/YY
    cvv?: string;   // never stored after validation
    mobileNumber?: string; // EasyPaisa / JazzCash
}

// ── Booking ────────────────────────────────────────────────

export type BookingStatus =
    | 'idle'
    | 'selecting-route'
    | 'selecting-datetime'
    | 'passenger-details'
    | 'payment'
    | 'confirmed'
    | 'cancelled';

export interface Booking {
    id: string;
    userId: string;
    routeId: string;
    scheduleId: string;
    seats: string[];    // seat IDs
    passenger: PassengerDetails;
    payment: PaymentDetails;
    totalAmount: number;
    status: BookingStatus;
    createdAt: string;      // ISO 8601
    confirmedAt?: string;
    cancellationReason?: string;
}

// ── Analytics (Dashboard) ──────────────────────────────────

export interface DashboardStats {
    totalRevenue: number;
    totalBookings: number;
    activePassengers: number;
    activeDrivers: number;
    revenueChange: number;    // % vs previous period
    bookingsChange: number;
    passengersChange: number;
    driversChange: number;
}

export interface RevenueDataPoint {
    label: string;   // e.g. "Mon", "Feb"
    revenue: number;
    bookings: number;
}

export interface PeakHourDataPoint {
    hour: number;   // 0–23
    count: number;
}

// ── API ────────────────────────────────────────────────────

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface ApiError {
    message: string;
    code?: string;
    statusCode?: number;
}

// ── Notification / Toast ───────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
    id: string;
    message: string;
    variant: ToastVariant;
    duration?: number;
}
