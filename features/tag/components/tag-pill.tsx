import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import type { Route } from 'next';

type Props = {
  tag: string;
};

export function TagPill({ tag }: Props) {
  return (
    <HoverPrefetchLink
      href={`/tag/${tag}` as Route}
      className="border-divider text-gray hover:border-accent hover:text-accent dark:border-divider-dark inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] transition-colors"
    >
      #{tag}
    </HoverPrefetchLink>
  );
}
