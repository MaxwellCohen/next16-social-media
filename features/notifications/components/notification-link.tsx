'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { fetcher, UNREAD_KEY } from '@/lib/swr';
import { cn } from '@/lib/utils';

type Props = React.ComponentProps<typeof PrefetchLink> & {
  unread: boolean;
};

export function NotificationLink({ className, unread, ...props }: Props) {
  const { data: unreadCount = 0 } = useSWR<number>(UNREAD_KEY, fetcher);
  const [flash] = useState(unread && unreadCount > 0);

  return <PrefetchLink {...props} className={cn(className, flash && 'flash-in')} />;
}
