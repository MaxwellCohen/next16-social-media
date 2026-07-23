import { NotFoundState } from '@/components/ui/not-found-state';

export default function DropNotFound() {
  return (
    <NotFoundState
      title="Drop not found"
      body="We couldn't find a drop at this URL. It may have been deleted or never existed."
      backHref="/"
    />
  );
}
