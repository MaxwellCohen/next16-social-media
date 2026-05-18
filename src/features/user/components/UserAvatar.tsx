import { getCurrentUserHandle, getUserByHandle } from '@/data/queries/user';
import { cn } from '@/lib/utils';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  handle?: string;
  size?: Size;
  className?: string;
};

const sizes: Record<Size, string> = {
  lg: 'h-14 w-14 text-lg',
  md: 'h-10 w-10 text-sm',
  sm: 'h-8 w-8 text-xs',
};

export async function UserAvatar({ handle, size = 'md', className }: Props) {
  const user = await getUserByHandle(handle ?? (await getCurrentUserHandle()));
  return (
    <div
      aria-hidden
      className={cn(
        'flex items-center justify-center rounded-full bg-gradient-to-br font-semibold text-white uppercase shadow-sm',
        user.avatarColor,
        sizes[size],
        className,
      )}
    >
      {user.displayName.charAt(0).toUpperCase()}
    </div>
  );
}

export function UserAvatarSkeleton({ size = 'md', className }: { size?: Size; className?: string }) {
  return <div aria-hidden className={cn('skeleton-animation shrink-0 rounded-full', sizes[size], className)} />;
}
