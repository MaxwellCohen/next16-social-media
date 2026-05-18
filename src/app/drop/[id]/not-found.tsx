import Link from 'next/link';

export default function DropNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <h2 className="text-lg font-bold tracking-tight uppercase">Drop not found</h2>
      <p className="text-gray text-sm">
        We couldn&apos;t find a drop at this URL. It may have been deleted or never existed.
      </p>
      <Link href="/" className="text-accent text-sm hover:underline">
        Back to the feed
      </Link>
    </div>
  );
}
