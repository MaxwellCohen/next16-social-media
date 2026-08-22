import { Ban } from 'lucide-react';

/** Visible when scripts are off — plain POST, works with zero JS. */
export function EnableScriptsForm() {
  return (
    <form
      action="/api/demo/scripts"
      method="post"
      className="border-divider dark:border-divider-dark flex items-center overflow-hidden rounded-full border bg-white/80 text-xs font-medium shadow-sm backdrop-blur-md dark:bg-black/80"
    >
      <input type="hidden" name="enable" value="1" />
      <button
        type="submit"
        className="text-accent focus-visible:bg-accent/10 dark:focus-visible:bg-accent/20 flex items-center gap-1.5 px-3 py-1.5 transition-colors focus-visible:outline-none"
        aria-label="Scripts off — turn back on"
      >
        <Ban className="size-3.5" />
        <span className="hidden lg:inline">Scripts off — turn back on</span>
        <span className="lg:hidden">Scripts off</span>
      </button>
    </form>
  );
}
