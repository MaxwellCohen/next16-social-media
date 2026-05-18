type Props = {
  className?: string;
  size?: number;
};

/**
 * Drop mark: a single solid droplet. Renders in `currentColor` so callers
 * control the fill (white in dark mode, near-black in light mode).
 */
export function DropMark({ className, size = 20 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path d="M12 0 Q4 14 2 22 A10 10 0 1 0 22 22 Q20 14 12 0 Z" fill="currentColor" />
    </svg>
  );
}

export function DropWordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <DropMark size={20} />
      <span className="font-bold tracking-tight">drop</span>
    </span>
  );
}
