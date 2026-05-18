import Link from 'next/link';
import { DropMark } from '@/components/ui/DropMark';

export default function ProfileNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <DropMark size={40} className="text-divider dark:text-divider-dark" />
      <h2 className="text-lg font-bold tracking-tight uppercase">Profile not found</h2>
      <p className="text-gray text-sm">No user with that handle. They may have changed it, or they were never here.</p>
      <Link href="/" className="text-accent text-sm hover:underline">
        Back to the feed
      </Link>
    </div>
  );
}
