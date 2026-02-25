# Security Architecture — venService

## ⚠️ Critical: Client-Side RBAC is NOT Security

The frontend role-based routing is **UX only**. A user can:
- Open DevTools and change React state
- Bypass `ProtectedRoute` by calling APIs directly
- Inspect the JWT payload (it's Base64, not encrypted)

**Every protected action MUST be enforced by the API gateway.**

---

## Token Handling Architecture

### ✅ Secure Pattern (Implemented)

```
Browser Memory (in-memory only)
  ├── Access Token (15-min TTL)     ← tokenStore.ts module variable
  └── CSRF Token (read from cookie) ← non-HttpOnly cookie

Browser Cookies (HttpOnly, Secure, SameSite=Strict)
  └── Refresh Token (7-day TTL)     ← set by server, NEVER readable by JS
```

### ❌ Anti-patterns (Removed)

```
localStorage.setItem('token', accessToken)  // XSS can steal this
sessionStorage.setItem('user', JSON.stringify(user))  // Survives XSS
```

---

## Authentication Flow

```
1. Login POST /api/auth/login
   ├── Server validates credentials
   ├── Server sets HttpOnly refresh_token cookie
   ├── Server returns { user, accessToken, expiresIn }
   └── Client stores accessToken in-memory (tokenStore)

2. API Requests
   ├── Client reads tokenStore.get()
   ├── Sets Authorization: Bearer <accessToken>
   └── Sets X-CSRF-Token: <csrf_token from non-HttpOnly cookie>

3. Token Refresh (silent, scheduled)
   ├── Timer fires 60s before expiry
   ├── POST /api/auth/refresh (sends HttpOnly refresh cookie automatically)
   ├── Server validates refresh token, issues new access token
   └── Client updates in-memory store

4. Logout
   ├── POST /api/auth/logout (invalidates refresh token server-side)
   └── Client clears in-memory token
```

---

## CSRF Protection

**Double Submit Cookie Pattern:**

1. Server sets `csrf_token=<random>` cookie (NOT HttpOnly)
2. Client JS reads the cookie and sends it as `X-CSRF-Token` header
3. Server validates that header matches the cookie
4. Attacker's cross-origin request cannot read the cookie → attack fails

```typescript
// getCsrfToken() in AuthContext.tsx
export function getCsrfToken(): string | null {
  const match = /(?:^|;\s*)csrf_token=([^;]*)/.exec(document.cookie);
  return match?.[1] ?? null;
}
```

---

## XSS Mitigation

1. **React's JSX** escapes all dynamic content by default
2. **Never use** `dangerouslySetInnerHTML` with user content
3. **Content-Security-Policy** header (server-configured):
   ```
   Content-Security-Policy:
     default-src 'self';
     script-src 'self';
     style-src 'self' 'unsafe-inline';
     img-src 'self' data: https:;
     connect-src 'self' https://api.venservice.pk;
   ```
4. **SameSite=Strict** on all auth cookies
5. **HttpOnly** on refresh token cookie

---

## API Gateway Auth Flow

```
Client → CDN/WAF → API Gateway → Microservices

API Gateway responsibilities:
  1. Validate JWT signature (RS256, public key from JWKS endpoint)
  2. Check expiry (exp claim)
  3. Check issuer (iss claim)
  4. Extract user.id and user.role
  5. Forward as X-User-Id and X-User-Role headers to downstream
  6. Microservices trust these headers (internal network only)
```

---

## Role Enforcement Examples

### ❌ Frontend-only (INSECURE — never do this)
```typescript
// This can be bypassed by anyone with DevTools
if (user.role === 'admin') {
  showAdminPanel();
}
```

### ✅ Correct: API enforces, frontend shows UX state
```typescript
// Frontend: just a UX hint
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

// API (Express/NestJS):
function requireAdmin(req, res, next) {
  // X-User-Role set by API Gateway after JWT validation
  if (req.headers['x-user-role'] !== 'admin') {
    return res.status(403).json({ code: 'FORBIDDEN' });
  }
  next();
}

router.delete('/bookings/:id', requireAdmin, deleteBooking);
```

---

## Dependency Security

```bash
# Run regularly in CI
npm audit --audit-level=high

# Automated PRs via Dependabot (GitHub)
# .github/dependabot.yml
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
    open-pull-requests-limit: 5
```
