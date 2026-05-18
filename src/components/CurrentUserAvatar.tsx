import { UserAvatar } from '@/components/UserAvatar';
import { getCurrentUser } from '@/data/queries/user';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';

const sizeMap: Record<Size, string> = {
  lg: 'h-14 w-14',
  md: 'h-10 w-10',
  sm: 'h-8 w-8',
};

export async function CurrentUserAvatar({ size = 'md', className }: { size?: Size; className?: string }) {
  const user = await getCurrentUser();
  return <UserAvatar handle={user.handle} size={size} className={className} />;
}

export function CurrentUserAvatarSkeleton({ size = 'md', className }: { size?: Size; className?: string }) {
  return <div aria-hidden className={cn('skeleton-animation shrink-0 rounded-full', sizeMap[size], className)} />;
}
