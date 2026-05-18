import { highlight, normalizeLang } from '@/lib/syntax';

type Props = {
  lang: string;
  code: string;
};

export async function CodeBlock({ lang, code }: Props) {
  const html = await highlight(code, lang);
  const normalized = normalizeLang(lang);

  return (
    <div className="border-divider bg-card dark:border-divider-dark dark:bg-card-dark overflow-hidden rounded-sm border">
      <div className="border-divider/70 dark:border-divider-dark/70 flex items-center justify-between border-b px-3 py-1.5">
        <span className="text-gray font-mono text-[11px] tracking-wide uppercase">{normalized}</span>
      </div>
      <div
        className="shiki-block overflow-x-auto p-3 font-mono text-xs leading-relaxed"
        // Shiki produces escaped HTML; safe to inject.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
