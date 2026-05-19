import { Bug, Check, Cloud, Droplet, Flame, GitMerge, Rocket, Terminal, Wrench, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CustomEmoji = {
  name: string;
  label: string;
  shortcode: string;
  icon: (props: { size?: number; className?: string }) => React.ReactNode;
};

function lucide(Icon: React.FC<{ size?: number; className?: string }>, color: string) {
  return function Emoji({ size = 14, className }: { size?: number; className?: string }) {
    return <Icon size={size} className={cn('inline-block align-middle', color, className)} />;
  };
}

export const CUSTOM_EMOJIS: CustomEmoji[] = [
  { icon: lucide(Droplet, 'text-indigo-500'), label: 'Drop', name: 'drop', shortcode: ':drop:' },
  { icon: lucide(Rocket, 'text-amber-500'), label: 'Ship it', name: 'shipit', shortcode: ':shipit:' },
  { icon: lucide(Check, 'text-green-500'), label: 'LGTM', name: 'lgtm', shortcode: ':lgtm:' },
  { icon: lucide(GitMerge, 'text-violet-400'), label: 'Merged', name: 'merge', shortcode: ':merge:' },
  { icon: lucide(Zap, 'text-amber-400'), label: 'Zap', name: 'zap', shortcode: ':zap:' },
  { icon: lucide(Flame, 'text-orange-500'), label: 'Fire', name: 'fire', shortcode: ':fire:' },
  { icon: lucide(Bug, 'text-emerald-500'), label: 'Bug', name: 'bug', shortcode: ':bug:' },
  { icon: lucide(Cloud, 'text-sky-400'), label: 'Deploy', name: 'deploy', shortcode: ':deploy:' },
  { icon: lucide(Wrench, 'text-rose-400'), label: 'Hotfix', name: 'hotfix', shortcode: ':hotfix:' },
  { icon: lucide(Terminal, 'text-violet-400'), label: 'Terminal', name: 'terminal', shortcode: ':terminal:' },
];

const EMOJI_MAP = new Map(
  CUSTOM_EMOJIS.map(e => {
    return [e.shortcode, e];
  }),
);

const SHORTCODE_RE = new RegExp(
  `(${CUSTOM_EMOJIS.map(e => {
    return e.shortcode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('|')})`,
  'g',
);

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
