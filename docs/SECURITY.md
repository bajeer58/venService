# venService — Security Model

> **Version:** 2.0 | **Auth Strategy:** JWT · RBAC · React ProtectedRoute

---

## Role-Based Access Control (RBAC)

### Roles

| Role | Description | Dashboard Access |
|------|-------------|-----------------|
| `passenger` | Default authenticated user | None |
| `staff` | Internal operations team | `/admin` |
| `admin` | Full system administrator | `/admin` |
| `driver` | Service delivery driver | `/driver` |

### Route Guards

All protected routes are wrapped in `<ProtectedRoute allowedRoles={[...]}>` before any layout or page renders.

```tsx
// Correct — guard wraps the layout
<Route element={
  <ProtectedRoute allowedRoles={['admin', 'staff']}>
    <DashboardLayout />
  </ProtectedRoute>
}>
  <Route path="/admin" element={<AdminDashboardPage />} />
</Route>
```

---

## Authentication Flow

```
1. User submits credentials on /login
2. AuthContext.login() calls backend API (currently mocked)
3. JWT returned → stored in memory (authState.user.accessToken)
4. User object persisted to localStorage (no token in localStorage)
5. On page reload → user object rehydrated, token is re-fetched
6. logout() clears both memory state and localStorage
```

> ⚠️ **Production requirement:** Move token storage to `httpOnly` cookies.
> Never store JWT in localStorage at production scale.

---

## Token Handling

| Property | Current (Mock) | Production Target |
|----------|---------------|-------------------|
| Storage | `localStorage` | `httpOnly` cookie |
| Expiry | None (mock) | 15 min access + 7 day refresh |
| Refresh | Not implemented | Silent refresh via `/auth/refresh` |
| Revocation | Logout clears local state | Server-side token blocklist |

---

## Input Validation

All booking and payment inputs are validated via `src/domains/booking/paymentValidation.ts` before any state transition or API call.

Validation rules:
- Card number — Luhn algorithm check
- CVV — 3–4 digit numeric
- Expiry — not in the past
- Passenger details — required fields, email format

---

## API Security (Backend — Node.js/Express)

> See backend repo for full implementation.

- All `/api/v1/*` routes require `Authorization: Bearer <token>` header
- Role is validated server-side on every request — client role is untrusted
- SQL queries use parameterised statements (no raw string interpolation)
- Rate limiting applied to `/auth/login` (5 req / 15 min per IP)
- CORS restricted to production domain only

---

## Security Checklist

- [x] ProtectedRoute prevents unauthorised page access
- [x] Role validated on every protected render
- [x] AuthContext clears all state on logout
- [x] No sensitive data logged to console in production build
- [ ] Token moved to httpOnly cookie
- [ ] Silent refresh implemented
- [ ] CSRF protection on cookie-based auth
- [ ] Content Security Policy headers configured

---

## Reporting Vulnerabilities

Please report security issues privately to the repository owner. Do not open a public issue.
