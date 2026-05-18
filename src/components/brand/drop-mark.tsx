type Props = {
  className?: string;
  size?: number;
};

/**
 * Drop mark: a geometric droplet inspired by Vercel's wordmark approach.
 * Two triangular halves form a teardrop. Right half is the accent.
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
      {/* Left half: foreground (currentColor) */}
      <path d="M12 0 L0 24 A12 12 0 0 0 12 32 Z" fill="currentColor" />
      {/* Right half: accent blue */}
      <path d="M12 0 L24 24 A12 12 0 0 1 12 32 Z" fill="var(--color-accent)" />
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
