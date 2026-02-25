# venService — Enterprise Frontend Architecture

> **Refactor Guide for Staff-Level Engineers**
> React 19 + TypeScript + Vite · Tailwind v4 + Framer Motion

---

## 1. High-Level System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        BROWSER                                │
│                                                               │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────────┐ │
│  │  Auth Domain │  │ Booking Domain │  │ Dashboard Domain  │ │
│  │  (AuthCtx)   │  │  (State FSM)   │  │  (TanStack Query) │ │
│  └──────┬───────┘  └───────┬────────┘  └────────┬─────────┘ │
│         │                  │                     │           │
│  ┌──────▼──────────────────▼─────────────────────▼────────┐ │
│  │              Shared UI System                           │ │
│  │   atoms / molecules / organisms / pages                 │ │
│  │   Design Tokens → Tailwind Config                       │ │
│  └──────────────────────────┬──────────────────────────────┘ │
│                             │                                 │
│  ┌──────────────────────────▼──────────────────────────────┐ │
│  │           API Client (typed, auth-injected)              │ │
│  └──────────────────────────┬──────────────────────────────┘ │
└───────────────────────────────────────────────────────────────┘
                              │ HTTPS + Bearer Token
                              ▼
┌──────────────────────────────────────────────────────────────┐
│            API GATEWAY (JWT validation + RBAC)                │
│   Kong / AWS API GW / custom NestJS Gateway                   │
└──────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼─────────────────────┐
         ▼                    ▼                     ▼
   Booking Service      Auth Service         Van Service
   (NestJS/FastAPI)   (NestJS/FastAPI)    (NestJS/FastAPI)
```

---

## 2. State Management Decision

### Why NOT Zustand or Redux Toolkit?

| Criterion           | Context + useReducer | Zustand | Redux Toolkit |
|---------------------|----------------------|---------|---------------|
| Bundle size         | 0kb (built-in)       | ~3kb    | ~11kb         |
| Domain isolation    | ✅ Per-provider       | ⚠️ Single store | ⚠️ Slices     |
| Boilerplate         | Low (with hooks)     | Minimal | Medium        |
| Time-travel debug   | ❌                   | ❌       | ✅             |
| Team familiarity    | ✅ React standard     | Medium  | High          |
| Scale threshold     | <10 domains          | Any     | Large teams   |

**Decision: Context + useReducer per domain.**
- Booking, Auth, Dashboard are isolated domains — no shared global state
- Co-locate state with its domain (not a global singleton)
- If cross-domain state grows: **add Zustand as a supplemental global store**
- Server state: **TanStack Query** (never store API responses in Context)

### State Topology

```
React Tree:
  <QueryClientProvider>          ← TanStack Query (server state)
    <AuthProvider>               ← Auth domain (in-memory token, user)
      <BookingProvider>          ← Booking domain (draft, step, FSM)
        <Toaster />              ← Notifications (event bus, not React state)
        <AppRouter />
```

---

## 3. Booking Flow State Machine

### FSM Diagram

```
                    SELECT_VAN
  [IDLE] ─────────────────────────► [STEP 1: Van]
                                          │
                               AUTO-ADVANCE (no Continue needed)
                                          │
                                          ▼
                                    [STEP 2: Dates]
                                          │
                               NEXT_STEP (validated)
                                          │
                                          ▼
                                   [STEP 3: Payment]
                                          │
                               NEXT_STEP (validated)
                                          │
                                          ▼
                                [STEP 4: Confirmation]
                                          │
                                       SUBMIT
                                          │
                              ┌───────────┴──────────┐
                          SUCCESS                  ERROR
                              │                       │
                           [RESET]           [STEP 4 + error]
```

### Critical Fixes

**Before (broken):**
```typescript
// BUG: Duplicate state — Context had selectedVan, hook had selectedVan
// They could diverge on rerender
const { selectedVan } = useBookingContext(); // Context copy
const { selectedVan } = useBooking();        // Hook copy — which is real?

// BUG: Step transition without validation
const goNext = () => setStep(step + 1); // skips validation entirely
```

**After (fixed):**
```typescript
// Single source of truth — only the reducer owns state
const { selectVan } = useBookingActions(); // action dispatched to reducer

// Validated transitions
dispatch({ type: 'NEXT_STEP' }); // reducer runs canAdvanceFromStep()
// If validation fails, step stays same, validationErrors is populated
```

---

## 4. Payment Validation

### Coverage

| Method         | Validations                                        |
|----------------|----------------------------------------------------|
| Credit/Debit   | Luhn algorithm, expiry (not past), CVV format      |
| Easypaisa      | PK mobile regex `03XX-XXXXXXX`, account title      |
| JazzCash       | PK mobile regex, account title                     |
| Bank Transfer  | IBAN structure, PK IBAN strict pattern             |

### Error Handling Pattern

```typescript
// In PaymentForm component:
const result = validatePaymentDetails(method, formValues);

if (!result.success) {
  // result.errors is Record<fieldName, errorMessage>
  // Render inline field errors — never alert/console.error
  setFieldErrors(result.errors);
  return;
}

// result.data is fully typed PaymentDetails
dispatch({ type: 'SET_PAYMENT', details: result.data });
```

---

## 5. Design System

### Token Hierarchy

```
Raw Values (tokens.ts)
  └─► Tailwind Config (tailwind.config.ts)
        └─► CSS Classes (className="bg-brand-500 text-danger-dark")
              └─► Components (Button, Badge, Card...)
                    └─► Features (BookingWizard, DashboardPage...)
```

### Atomic Design Structure

```
atoms/         → Button, Input, Badge, Card, Skeleton, KPICard
molecules/     → FormField, Toast, Modal, Dropdown, SearchBar
organisms/     → BookingWizard, BookingsTable, NavBar, VanGrid
pages/         → BookingPage, DashboardPage, LoginPage, HomePage
```

### Component Variant Pattern (cva)

```typescript
const buttonVariants = cva(baseClasses, {
  variants: {
    variant: { primary: '...', secondary: '...', danger: '...' },
    size:    { sm: '...', md: '...', lg: '...' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
});
// Zero ad-hoc Tailwind in feature components
```

---

## 6. Folder Structure

```
src/
├── app/
│   ├── router.tsx              # Route definitions, code splitting
│   ├── providers.tsx           # Compose all providers
│   └── App.tsx
│
├── domains/                    # Feature domains — colocate everything
│   ├── auth/
│   │   ├── AuthContext.tsx     # State + actions + token store
│   │   ├── hooks/
│   │   │   └── useAuth.ts      # Re-exported for convenience
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── UserMenu.tsx
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       └── ProfilePage.tsx
│   │
│   ├── booking/
│   │   ├── bookingMachine.ts   # Reducer + guards + persistence
│   │   ├── BookingContext.tsx  # Provider + hooks
│   │   ├── paymentValidation.ts# Zod schemas
│   │   ├── bookingService.ts   # API calls (used by React Query)
│   │   ├── hooks/
│   │   │   └── useBookingQueries.ts
│   │   ├── components/
│   │   │   ├── BookingWizard.tsx
│   │   │   ├── VanSelector.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── BookingConfirmation.tsx
│   │   ├── pages/
│   │   │   ├── BookingPage.tsx
│   │   │   └── HomePage.tsx
│   │   └── __tests__/
│   │       ├── bookingMachine.test.ts
│   │       └── paymentValidation.test.ts
│   │
│   └── dashboard/
│       ├── hooks/
│       │   └── useDashboard.ts
│       ├── components/
│       │   ├── DashboardPage.tsx
│       │   ├── RevenueChart.tsx  # Recharts abstraction
│       │   ├── BookingsTable.tsx
│       │   └── KPIGrid.tsx
│       └── pages/
│           └── DashboardPage.tsx
│
├── shared/
│   ├── components/
│   │   ├── atoms/
│   │   │   └── index.tsx       # Button, Input, Badge, Card, Skeleton
│   │   ├── molecules/
│   │   │   ├── Toast/
│   │   │   ├── Modal/
│   │   │   └── DataTable/
│   │   └── organisms/
│   │       └── NavBar/
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useKeyboardShortcut.ts
│   ├── utils/
│   │   ├── cn.ts               # clsx + tailwind-merge
│   │   ├── date.ts
│   │   └── currency.ts
│   └── types/
│       └── domain.ts           # All domain types — single source of truth
│
├── lib/
│   ├── index.ts                # api client, queryClient, featureFlags
│   └── storybook/
│       └── decorators.tsx
│
└── styles/
    ├── globals.css             # Tailwind base, CSS variables
    └── tokens.ts               # Design tokens
```

---

## 7. Performance Engineering

### Code Splitting

```typescript
// Route-level (implemented in router.tsx)
const DashboardPage = lazy(() => import('../domains/dashboard/pages/DashboardPage'));
// Recharts (~170kb gzipped) only loads for admin routes

// Component-level
const VirtualizedTable = lazy(() => import('./VirtualizedTable'));
```

### Memoization Strategy

```typescript
// ✅ Memoize expensive selectors
const sortedBookings = useMemo(
  () => [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  [bookings]
);

// ✅ Stable callbacks (already applied in BookingContext)
const selectVan = useCallback((van: Van) => dispatch(...), []);

// ✅ Granular selectors prevent over-rendering
const step = useBookingSelector(s => s.step); // re-renders on step change only
const van  = useBookingSelector(s => s.draft.selectedVan); // independent subscription
```

### Virtualized Tables

```typescript
// For 500+ bookings: use react-virtual
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualBookingsTable({ bookings }) {
  const rowVirtualizer = useVirtualizer({
    count:          bookings.length,
    getScrollElement: () => parentRef.current,
    estimateSize:   () => 56,
    overscan:       10,
  });
  // Only renders visible rows — 10,000 bookings = same perf as 10
}
```

### Lighthouse Targets

| Metric              | Target  |
|---------------------|---------|
| LCP                 | < 1.8s  |
| FID / INP           | < 100ms |
| CLS                 | < 0.05  |
| Bundle (initial)    | < 150kb |
| Bundle (dashboard)  | < 300kb |

---

## 8. Scalability Roadmap

### Multi-Tenant White-Label SaaS

```typescript
// src/lib/tenant.ts
interface TenantConfig {
  id:        string;
  name:      string;
  logoUrl:   string;
  colors:    { brand: string; accent: string };
  features:  FlagKey[];
}

// CSS variables enable runtime theming (no rebuild)
function applyTenantTheme(config: TenantConfig) {
  const root = document.documentElement;
  root.style.setProperty('--color-brand-500', config.colors.brand);
  root.style.setProperty('--color-accent',    config.colors.accent);
}
```

### Microservices API Layer

```
React Query         → Cache layer (staleTime, gcTime)
   └─► api.ts       → Auth token injection, CSRF
         └─► /api   → BFF (Backend for Frontend)
               ├─► /api/bookings → Booking Microservice
               ├─► /api/auth     → Auth Microservice
               └─► /api/vans     → Van Catalog Microservice

BFF advantages:
  - Aggregates multiple service calls → 1 network request for client
  - Shields frontend from microservice topology changes
  - Handles auth centrally
```

### Storybook Setup

```bash
npx storybook@latest init
# Then for each atom:

# src/shared/components/atoms/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './index';

const meta: Meta<typeof Button> = {
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story    = { args: { children: 'Book Now',   variant: 'primary' } };
export const Secondary: Story  = { args: { children: 'Go Back',    variant: 'secondary' } };
export const Loading: Story    = { args: { children: 'Submitting', loading: true } };
export const Danger: Story     = { args: { children: 'Cancel',     variant: 'danger' } };
```

### ESLint + TypeScript Strict Mode

```json
// tsconfig.app.json additions
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## Implementation Priority

| Priority | Task                            | Effort |
|----------|---------------------------------|--------|
| 🔴 P0    | Fix duplicate booking state     | 1 day  |
| 🔴 P0    | Add payment validation (Zod)    | 1 day  |
| 🔴 P0    | Secure token handling           | 1 day  |
| 🟡 P1    | Booking state machine           | 2 days |
| 🟡 P1    | Design tokens + Tailwind config | 1 day  |
| 🟡 P1    | Atomic component library        | 3 days |
| 🟢 P2    | TanStack Query integration      | 2 days |
| 🟢 P2    | Toast system                    | 0.5d   |
| 🟢 P2    | Dashboard KPI + charts          | 2 days |
| 🔵 P3    | Storybook setup                 | 1 day  |
| 🔵 P3    | Unit tests (machine + validation)| 2 days |
| 🔵 P3    | Playwright E2E                  | 2 days |
| ⚪ P4    | Virtualized table               | 1 day  |
| ⚪ P4    | Feature flags                   | 1 day  |
| ⚪ P4    | Multi-tenant theming            | 3 days |
