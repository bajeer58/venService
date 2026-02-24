/* ─────────────────────────────────────────────
   Reusable Badge component for status indicators.
   ───────────────────────────────────────────── */

interface BadgeProps {
  color: 'green' | 'amber' | 'red' | 'muted';
  children: React.ReactNode;
}

const colorClasses: Record<BadgeProps['color'], string> = {
  green: 'badge badge-green',
  amber: 'badge badge-amber',
  red: 'badge badge-red',
  muted: 'badge badge-muted',
};

export default function Badge({ color, children }: BadgeProps) {
  return <span className={colorClasses[color]}>{children}</span>;
}
