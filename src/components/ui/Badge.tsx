/* ─────────────────────────────────────────────
   Reusable Badge component for status indicators.
   ───────────────────────────────────────────── */

interface BadgeProps {
  color: 'green' | 'amber' | 'red' | 'muted' | 'blue' | 'indigo';
  children: React.ReactNode;
}

const colorClasses: Record<BadgeProps['color'], string> = {
  green: 'badge badge-green',
  amber: 'badge badge-amber',
  red: 'badge badge-red',
  muted: 'badge badge-muted',
  blue: 'badge badge-blue',
  indigo: 'badge badge-indigo',
};

export default function Badge({ color, children }: BadgeProps) {
  return <span className={colorClasses[color]}>{children}</span>;
}
