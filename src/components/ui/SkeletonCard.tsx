/* ─────────────────────────────────────────────
   SkeletonCard.tsx — venService v2.0
   Shimmer loading skeleton for route/KPI cards.
   ───────────────────────────────────────────── */

import React from 'react';

interface SkeletonProps {
    width?: string | number;
    height?: string | number;
    radius?: string;
    style?: React.CSSProperties;
}

/** Single skeleton line/block */
export const SkeletonLine: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 14,
    radius = 'var(--radius-xs)',
    style,
}) => (
    <div
        className="skeleton"
        aria-hidden="true"
        style={{ width, height, borderRadius: radius, ...style }}
    />
);

/** Full route card skeleton */
const SkeletonCard: React.FC = () => (
    <div
        aria-busy="true"
        aria-label="Loading…"
        style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
        }}
    >
        {/* Image area */}
        <SkeletonLine height={160} radius="0" />
        {/* Body */}
        <div style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <SkeletonLine width="40%" height={10} />
            <SkeletonLine width="75%" height={18} />
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <SkeletonLine width="50%" height={14} />
                <SkeletonLine width="40%" height={14} />
            </div>
        </div>
    </div>
);

export default SkeletonCard;
