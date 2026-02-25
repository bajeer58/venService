/* ─────────────────────────────────────────────
   Toast.tsx — venService v2.0
   Legacy component: Toast renderer is now
   embedded inside ToastProvider in ToastContext.tsx.
   This shim just re-exports nothing but keeps the
   import from crashing if still used anywhere.
   ───────────────────────────────────────────── */

// Toast rendering is now done inside <ToastProvider> in context/ToastContext.tsx
// This empty export prevents import errors in any old code still referencing this file
export default function Toast() {
  return null;
}
