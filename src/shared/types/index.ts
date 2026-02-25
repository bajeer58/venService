/* ═══════════════════════════════════════════════════════════
   src/shared/types/index.ts — venService v2.0
   Barrel re-export of all shared domain types.
   Import from '@shared/types' instead of the full path.
   ═══════════════════════════════════════════════════════════ */

export type {
    UserRole,
    User,
    ServiceRoute,
    Schedule,
    SeatStatus,
    Seat,
    PassengerDetails,
    PaymentMethod,
    PaymentDetails,
    BookingStatus,
    Booking,
    DashboardStats,
    RevenueDataPoint,
    PeakHourDataPoint,
    ApiResponse,
    ApiError,
    ToastVariant,
    ToastMessage,
} from './domain';
