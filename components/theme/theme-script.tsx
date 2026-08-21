import type { ThemePreference } from '@/components/theme/theme-constants';

/** Inline script: applies dark class for system preference before paint. */
export function ThemeScript({ theme }: { theme: ThemePreference }) {
  if (theme !== 'system') return null;
  const code = `(function(){try{if(window.matchMedia('(prefers-color-scheme: dark)').matches)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
