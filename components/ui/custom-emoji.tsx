import { cn } from '@/lib/utils';

export type CustomEmoji = {
  name: string;
  label: string;
  shortcode: string;
  icon: (props: { size?: number; className?: string }) => React.ReactNode;
};

function DropIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block align-middle', className)}
      aria-hidden
    >
      <path d="M12 0 Q4 14 2 22 A10 10 0 1 0 22 22 Q20 14 12 0 Z" fill="currentColor" />
    </svg>
  );
}

function ShipIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block align-middle', className)}
      aria-hidden
    >
      <path d="M12 2L4 14h16L12 2z" fill="currentColor" />
      <rect x="10" y="14" width="4" height="8" rx="1" fill="currentColor" />
    </svg>
  );
}

function ZapIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block align-middle', className)}
      aria-hidden
    >
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="currentColor" />
    </svg>
  );
}

function FireIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block align-middle', className)}
      aria-hidden
    >
      <path d="M12 23c-4.97 0-9-3.58-9-8 0-3.18 2.56-6.44 5-8.5.35-.3.88-.02.82.44-.3 2.3.6 3.56 1.68 4.56.3.28.75.02.68-.4C10.8 8.8 11.5 6 14 3c.2-.24.58-.18.7.1C16.2 6.4 21 10.2 21 15c0 4.42-4.03 8-9 8z" fill="currentColor" />
    </svg>
  );
}

function SparkleIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block align-middle', className)}
      aria-hidden
    >
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" fill="currentColor" />
    </svg>
  );
}

function HeartIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block align-middle', className)}
      aria-hidden
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" />
    </svg>
  );
}

function EyeIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block align-middle', className)}
      aria-hidden
    >
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" fill="currentColor" />
      <circle cx="12" cy="12" r="3.5" fill="white" className="dark:fill-black" />
    </svg>
  );
}

function BulbIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block align-middle', className)}
      aria-hidden
    >
      <path d="M9 21h6v-1H9v1zm0-2h6v-1.5c0-1.1.6-2.1 1.5-2.7C18 13.5 19 11.4 19 9c0-3.87-3.13-7-7-7S5 5.13 5 9c0 2.4 1 4.5 2.5 5.8.9.6 1.5 1.6 1.5 2.7V19z" fill="currentColor" />
    </svg>
  );
}

export const CUSTOM_EMOJIS: CustomEmoji[] = [
  { icon: DropIcon, label: 'Drop', name: 'drop', shortcode: ':drop:' },
  { icon: ShipIcon, label: 'Ship it', name: 'ship', shortcode: ':ship:' },
  { icon: ZapIcon, label: 'Zap', name: 'zap', shortcode: ':zap:' },
  { icon: FireIcon, label: 'Fire', name: 'fire', shortcode: ':fire:' },
  { icon: SparkleIcon, label: 'Sparkle', name: 'sparkle', shortcode: ':sparkle:' },
  { icon: HeartIcon, label: 'Heart', name: 'heart', shortcode: ':heart:' },
  { icon: EyeIcon, label: 'Eyes', name: 'eyes', shortcode: ':eyes:' },
  { icon: BulbIcon, label: 'Idea', name: 'bulb', shortcode: ':bulb:' },
];

const EMOJI_MAP = new Map(CUSTOM_EMOJIS.map(e => [e.shortcode, e]));

const SHORTCODE_RE = /(:(?:drop|ship|zap|fire|sparkle|heart|eyes|bulb):)/g;

export function renderCustomEmojis(text: string): React.ReactNode[] {
  const parts = text.split(SHORTCODE_RE);
  return parts.map((part, i) => {
    const emoji = EMOJI_MAP.get(part);
    if (emoji) {
      return <emoji.icon key={i} size={16} className="mx-0.5 text-black dark:text-white" />;
    }
    return part;
  });
}
