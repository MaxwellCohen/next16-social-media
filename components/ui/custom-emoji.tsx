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
  { icon: lucide(Droplet, 'text-accent'), label: 'Drop', name: 'drop', shortcode: ':drop:' },
  { icon: lucide(Rocket, 'text-warning'), label: 'Ship it', name: 'shipit', shortcode: ':shipit:' },
  { icon: lucide(Check, 'text-success'), label: 'LGTM', name: 'lgtm', shortcode: ':lgtm:' },
  { icon: lucide(GitMerge, 'text-accent'), label: 'Merged', name: 'merge', shortcode: ':merge:' },
  { icon: lucide(Zap, 'text-warning'), label: 'Zap', name: 'zap', shortcode: ':zap:' },
  { icon: lucide(Flame, 'text-danger'), label: 'Fire', name: 'fire', shortcode: ':fire:' },
  { icon: lucide(Bug, 'text-success'), label: 'Bug', name: 'bug', shortcode: ':bug:' },
  { icon: lucide(Cloud, 'text-accent'), label: 'Deploy', name: 'deploy', shortcode: ':deploy:' },
  { icon: lucide(Wrench, 'text-danger'), label: 'Hotfix', name: 'hotfix', shortcode: ':hotfix:' },
  { icon: lucide(Terminal, 'text-gray'), label: 'Terminal', name: 'terminal', shortcode: ':terminal:' },
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
