import { Skeleton } from '@/components/ui/skeleton';
import { getCurrentUserHandle, getUserByHandle } from '@/features/user/user-queries';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  handle: string;
  size?: Size;
  className?: string;
};

const sizes: Record<Size, string> = {
  lg: 'h-14 w-14 text-lg',
  md: 'h-10 w-10 text-sm',
  sm: 'h-8 w-8 text-xs',
};

export async function UserAvatar({ handle, size = 'md', className }: Props) {
  const user = await getUserByHandle(handle);
  return (
    <div
      aria-hidden
      className={cn(
        'flex items-center justify-center rounded-full bg-linear-to-br font-semibold text-white uppercase shadow-sm',
        user.avatarColor,
        sizes[size],
        className,
      )}
    >
      {user.displayName.charAt(0).toUpperCase()}
    </div>
  );
}

export async function CurrentUserAvatar({ size = 'md', className }: { size?: Size; className?: string }) {
  const handle = await getCurrentUserHandle();
  return <UserAvatar handle={handle} size={size} className={className} />;
}

export function UserAvatarSkeleton({ size = 'md', className }: { size?: Size; className?: string }) {
  return <Skeleton className={cn('shrink-0 rounded-full', sizes[size], className)} />;
}
