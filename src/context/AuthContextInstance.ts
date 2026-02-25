/* ═══════════════════════════════════════════════════════════
   AuthContextInstance.ts — SHIM for backwards compatibility
   Real implementation is now in AuthContext.tsx.
   This file can be deleted once all imports are updated.
   ═══════════════════════════════════════════════════════════ */

// Re-export everything from the consolidated file
export { useAuth } from './AuthContext';
export type { } from './AuthContext';
