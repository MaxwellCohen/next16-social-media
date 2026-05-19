import { cn } from '@/lib/utils';

export type CustomEmoji = {
  name: string;
  label: string;
  shortcode: string;
  icon: (props: { size?: number; className?: string }) => React.ReactNode;
};

function svgIcon(viewBox: string, path: string) {
  return function Icon({ size = 14, className }: { size?: number; className?: string }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('inline-block align-middle', className)}
        aria-hidden
        dangerouslySetInnerHTML={{ __html: path }}
      />
    );
  };
}

// :drop: — the platform icon, water drop
const DropIcon = svgIcon('0 0 24 32', '<path d="M12 0 Q4 14 2 22 A10 10 0 1 0 22 22 Q20 14 12 0 Z" fill="currentColor"/>');

// :shipit: — rocket launching (shipped!)
const ShipitIcon = svgIcon('0 0 24 24', '<path d="M4.5 16.5L2 22l5.5-2.5m0 0L12 2l4.5 17.5m-9 0h9M16.5 19.5L22 22l-5.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="12" cy="8" r="2" fill="currentColor"/>');

// :lgtm: — thumbs up, "looks good to me"
const LgtmIcon = svgIcon('0 0 24 24', '<path d="M7 22V11l3-8a1 1 0 011-.92h.44a1 1 0 01.98 1.2L11 8h7a2 2 0 012 2v1.5a2 2 0 01-.1.6l-2.4 7.2A2 2 0 0115.6 21H9a2 2 0 01-2-1zM4 11h2v11H4a1 1 0 01-1-1V12a1 1 0 011-1z" fill="currentColor"/>');

// :mindblown: — exploding head
const MindblownIcon = svgIcon('0 0 24 24', '<circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M8 9l1.5 1.5M14.5 9L13 10.5M9 15s1.5 2 3 2 3-2 3-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 5l2 2M17 5l-2 2M12 2v2M4 12H2M22 12h-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>');

// :merge: — git merge / PR merged
const MergeIcon = svgIcon('0 0 24 24', '<circle cx="6" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="18" cy="18" r="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="6" cy="18" r="2.5" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M6 8.5v7M8.5 6c3 0 7 2.5 7 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>');

// :zap: — lightning bolt, speed
const ZapIcon = svgIcon('0 0 24 24', '<polygon points="13,2 3,14 12,14 11,22 21,10 12,10" fill="currentColor"/>');

// :fire: — hot take, trending
const FireIcon = svgIcon('0 0 24 24', '<path d="M12 23c-4.97 0-9-3.58-9-8 0-3.18 2.56-6.44 5-8.5.35-.3.88-.02.82.44-.3 2.3.6 3.56 1.68 4.56.3.28.75.02.68-.4C10.8 8.8 11.5 6 14 3c.2-.24.58-.18.7.1C16.2 6.4 21 10.2 21 15c0 4.42-4.03 8-9 8z" fill="currentColor"/>');

// :100: — the hundred, perfect
const HundredIcon = svgIcon('0 0 24 24', '<text x="2" y="18" font-size="16" font-weight="900" font-family="system-ui" fill="currentColor">100</text>');

// :eyes: — watching, interested
const EyesIcon = svgIcon('0 0 24 24', '<ellipse cx="8" cy="12" rx="3.5" ry="4.5" stroke="currentColor" stroke-width="1.5" fill="none"/><ellipse cx="16" cy="12" rx="3.5" ry="4.5" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="9.5" cy="12" r="1.5" fill="currentColor"/><circle cx="17.5" cy="12" r="1.5" fill="currentColor"/>');

export const CUSTOM_EMOJIS: CustomEmoji[] = [
  { icon: DropIcon, label: 'Drop', name: 'drop', shortcode: ':drop:' },
  { icon: ShipitIcon, label: 'Ship it', name: 'shipit', shortcode: ':shipit:' },
  { icon: LgtmIcon, label: 'LGTM', name: 'lgtm', shortcode: ':lgtm:' },
  { icon: MergeIcon, label: 'Merged', name: 'merge', shortcode: ':merge:' },
  { icon: ZapIcon, label: 'Zap', name: 'zap', shortcode: ':zap:' },
  { icon: FireIcon, label: 'Fire', name: 'fire', shortcode: ':fire:' },
  { icon: MindblownIcon, label: 'Mind blown', name: 'mindblown', shortcode: ':mindblown:' },
  { icon: HundredIcon, label: '100', name: '100', shortcode: ':100:' },
  { icon: EyesIcon, label: 'Eyes', name: 'eyes', shortcode: ':eyes:' },
];

const EMOJI_MAP = new Map(CUSTOM_EMOJIS.map(e => [e.shortcode, e]));

const SHORTCODE_RE = new RegExp(`(${CUSTOM_EMOJIS.map(e => e.shortcode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

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
