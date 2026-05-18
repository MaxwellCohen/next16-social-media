import { highlight, normalizeLang } from "@/lib/syntax";

type Props = {
  lang: string;
  code: string;
};

export async function CodeBlock({ lang, code }: Props) {
  const html = await highlight(code, lang);
  const normalized = normalizeLang(lang);

  return (
    <div className="overflow-hidden rounded-lg border border-divider bg-card dark:border-divider-dark dark:bg-card-dark">
      <div className="flex items-center justify-between border-b border-divider/70 px-3 py-1.5 dark:border-divider-dark/70">
        <span className="text-gray font-mono text-[11px] uppercase tracking-wide">
          {normalized}
        </span>
      </div>
      <div
        className="shiki-block overflow-x-auto p-3 font-mono text-xs leading-relaxed"
        // Shiki produces escaped HTML; safe to inject.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
