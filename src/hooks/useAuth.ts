/* ═══════════════════════════════════════════════════════════
   useAuth.ts — SHIM for backwards compatibility
   Real implementation is in AuthContext.tsx.
   ═══════════════════════════════════════════════════════════ */

// Re-export the hook from the consolidated context file
export { useAuth } from '../context/AuthContext';
