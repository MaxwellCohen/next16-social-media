import { cn } from '@/lib/utils';

export type CustomEmoji = {
  name: string;
  label: string;
  shortcode: string;
  icon: (props: { size?: number; className?: string }) => React.ReactNode;
};

// The platform drop icon — the only custom SVG
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

// Native emoji wrapper — renders real system emoji at the right size
function nativeEmoji(emoji: string) {
  return function NativeEmoji({ size = 14, className }: { size?: number; className?: string }) {
    return (
      <span
        className={cn('inline-block align-middle leading-none', className)}
        style={{ fontSize: size }}
        aria-hidden
      >
        {emoji}
      </span>
    );
  };
}

export const CUSTOM_EMOJIS: CustomEmoji[] = [
  { icon: DropIcon, label: 'Drop', name: 'drop', shortcode: ':drop:' },
  { icon: nativeEmoji('🚀'), label: 'Ship it', name: 'shipit', shortcode: ':shipit:' },
  { icon: nativeEmoji('👍'), label: 'LGTM', name: 'lgtm', shortcode: ':lgtm:' },
  { icon: nativeEmoji('🔀'), label: 'Merged', name: 'merge', shortcode: ':merge:' },
  { icon: nativeEmoji('⚡'), label: 'Zap', name: 'zap', shortcode: ':zap:' },
  { icon: nativeEmoji('🔥'), label: 'Fire', name: 'fire', shortcode: ':fire:' },
  { icon: nativeEmoji('🤯'), label: 'Mind blown', name: 'mindblown', shortcode: ':mindblown:' },
  { icon: nativeEmoji('💯'), label: '100', name: '100', shortcode: ':100:' },
  { icon: nativeEmoji('👀'), label: 'Eyes', name: 'eyes', shortcode: ':eyes:' },
];

const EMOJI_MAP = new Map(CUSTOM_EMOJIS.map(e => [e.shortcode, e]));

const SHORTCODE_RE = new RegExp(`(${CUSTOM_EMOJIS.map(e => e.shortcode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

export function renderCustomEmojis(text: string): React.ReactNode[] {
  const parts = text.split(SHORTCODE_RE);
  return parts.map((part, i) => {
    const emoji = EMOJI_MAP.get(part);
    if (emoji) {
      return <emoji.icon key={i} size={16} className="mx-0.5" />;
    }
    return part;
  });
}
