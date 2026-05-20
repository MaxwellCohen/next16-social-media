'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  active: 'following' | 'foryou';
};

export function FeedTabs({ active }: Props) {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 flex border-b">
      <Link
        href="/"
        className={cn(
          'flex-1 py-3 text-center text-sm font-semibold transition-colors',
          active === 'following'
            ? 'border-accent border-b-2 text-black dark:text-white'
            : 'text-gray hover:text-black dark:hover:text-white',
        )}
      >
        Following
      </Link>
      <Link
        href="/?tab=foryou"
        className={cn(
          'flex-1 py-3 text-center text-sm font-semibold transition-colors',
          active === 'foryou'
            ? 'border-accent border-b-2 text-black dark:text-white'
            : 'text-gray hover:text-black dark:hover:text-white',
        )}
      >
        For you
      </Link>
    </div>
  );
}
