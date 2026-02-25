# venService — Architecture Overview

> **Version:** 2.0 | **Stack:** React 19 · TypeScript · Vite · Tailwind CSS v4

---

## Project Philosophy

venService is structured around **Domain-Driven Design (DDD)** principles with a clear separation between:

- **Domains** — business logic, state machines, and context
- **Shared** — reusable UI atoms/molecules and cross-domain types
- **Features** — page-level compositions (booking flow, services)
- **App** — routing and provider orchestration

---

## Directory Structure

```
venService/
├── docs/                        # Architecture & security docs
│   ├── ARCHITECTURE.md
│   └── SECURITY.md
│
├── src/
│   ├── app/
│   │   └── router.tsx           # Centralised route definitions
│   │
│   ├── domains/                 # Business domain modules
│   │   ├── auth/
│   │   │   └── AuthContext.tsx  # Auth state machine + provider
│   │   ├── booking/
│   │   │   ├── bookingMachine.ts      # XState-style state machine
│   │   │   ├── BookingContext.tsx     # Booking state provider
│   │   │   ├── paymentValidation.ts   # Zod/validation schemas
│   │   │   ├── hooks/
│   │   │   │   └── useBookingQueries.ts
│   │   │   └── _tests_/
│   │   │       └── tests.ts
│   │   └── dashboard/
│   │       └── components/
│   │           └── DashboardPage.tsx
│   │
│   ├── shared/                  # Cross-domain reusables
│   │   ├── types/
│   │   │   └── domain.ts        # Shared TypeScript interfaces
│   │   └── components/
│   │       ├── atoms/           # Primitive UI components
│   │       │   └── index.tsx
│   │       └── molecules/
│   │           └── Toast/       # Notification molecule
│   │               └── index.tsx
│   │
│   ├── styles/
│   │   ├── tokens.ts            # Design token constants (JS)
│   │   └── *.css                # Per-feature CSS modules
│   │
│   ├── lib/
│   │   └── index.ts             # Utility library exports
│   │
│   ├── features/                # Page-level feature compositions
│   ├── components/              # Legacy / transitional components
│   ├── context/                 # Legacy contexts (being migrated)
│   ├── pages/                   # Route-level page components
│   ├── layouts/                 # Shared layout wrappers
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API service layer
│   └── types/                   # Global TypeScript types
```

---

## Data Flow

```
User Action
    │
    ▼
  Domain Context (auth / booking)
    │
    ▼
  State Machine (bookingMachine.ts)
    │
    ▼
  Service Layer (src/services/)
    │
    ▼
  API / Backend
```

---

## State Management Strategy

| Layer | Tool | Purpose |
|-------|------|---------|
| Auth state | React Context + localStorage | Session persistence |
| Booking flow | Custom state machine | Multi-step form orchestration |
| Server state | Custom hooks (useBookingQueries) | Data fetching / caching |
| Toast / UI | React Context + react-hot-toast | Notification system |

---

## Routing Architecture

All routes are defined in `src/app/router.tsx` and consumed by `src/App.tsx`.

| Path | Access | Component |
|------|--------|-----------|
| `/` | Public | `HomePage` |
| `/booking` | Public | `BookingFlowPage` |
| `/login` | Public | `LoginPage` |
| `/verify` | Public | `VerifyPage` |
| `/admin` | `admin`, `staff` | `AdminDashboardPage` |
| `/driver` | `driver` | `DriverDashboardPage` |
| `*` | Public | `NotFoundPage` |

---

## Code Quality Standards

- **TypeScript strict mode** — all types must be explicit
- **ESLint + react-hooks plugin** — enforced hook rules
- **No barrel re-exports from `src/`** — use domain-specific imports
- **CSS variables** — all design tokens declared in `src/styles/variables.css`
- **Lazy loading** — all page-level components use `React.lazy()`

---

## Migration Path

Legacy code in `src/context/`, `src/components/` is being progressively migrated into `src/domains/` and `src/shared/` following the DDD refactor pattern.
