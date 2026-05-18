import 'server-only';

import { createHighlighter, type Highlighter } from 'shiki';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const SUPPORTED_LANGS = ['tsx', 'ts', 'jsx', 'js', 'bash', 'shell', 'json', 'css', 'html', 'md'] as const;

export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

/**
 * Process-wide singleton highlighter. `cache()` from React doesn't dedupe
 * across requests, so we keep a module-scoped promise instead.
 */
let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      engine: createJavaScriptRegexEngine({ forgiving: true }),
      langs: SUPPORTED_LANGS as unknown as string[],
      themes: ['github-light', 'github-dark'],
    });
  }
  return highlighterPromise;
}

export function normalizeLang(lang: string | undefined): SupportedLang {
  const l = (lang ?? '').toLowerCase();
  if ((SUPPORTED_LANGS as readonly string[]).includes(l)) {
    return l as SupportedLang;
  }
  if (l === 'sh' || l === 'zsh') return 'bash';
  if (l === 'typescript') return 'ts';
  if (l === 'javascript') return 'js';
  if (l === 'markdown') return 'md';
  return 'bash';
}

export async function highlight(code: string, lang: string | undefined) {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    cssVariablePrefix: '--shiki-',
    defaultColor: 'light',
    lang: normalizeLang(lang),
    themes: {
      dark: 'github-dark',
      light: 'github-light',
    },
  });
}
