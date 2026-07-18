import { NotFoundState } from '@/components/ui/not-found-state';

export default function ProfileNotFound() {
  return (
    <NotFoundState
      title="Profile not found"
      body="No user with that handle. They may have changed it, or they were never here."
      backHref="/"
    />
  );
}
