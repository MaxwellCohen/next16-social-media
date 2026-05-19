import { DropMark } from '@/components/ui/drop-mark';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <DropMark size={40} className="text-divider dark:text-divider-dark" />
      <h2 className="text-lg font-bold tracking-tight uppercase">Not found</h2>
      <p className="text-gray text-sm">This page does not exist.</p>
    </div>
  );
}
