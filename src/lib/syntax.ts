import 'server-only';

import DOMPurify from 'isomorphic-dompurify';
import { createHighlighter, type Highlighter, type ThemeRegistrationRaw } from 'shiki';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import vercelDarkRaw from './themes/vercel-dark.json';
import vercelLightRaw from './themes/vercel-light.json';

const vercelDark = vercelDarkRaw as unknown as ThemeRegistrationRaw;
const vercelLight = vercelLightRaw as unknown as ThemeRegistrationRaw;

const SUPPORTED_LANGS = ['tsx', 'ts', 'jsx', 'js', 'bash', 'shell', 'json', 'css', 'html', 'md'] as const;

export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      engine: createJavaScriptRegexEngine({ forgiving: true }),
      langs: SUPPORTED_LANGS as unknown as string[],
      themes: [vercelLight, vercelDark],
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function highlight(code: string, lang: string | undefined) {
  'use cache';
  const highlighter = await getHighlighter();
  let html: string;
  try {
    html = highlighter.codeToHtml(code, {
      cssVariablePrefix: '--shiki-',
      defaultColor: 'light',
      lang: normalizeLang(lang),
      themes: {
        dark: vercelDark.name ?? 'vercel-dark',
        light: vercelLight.name ?? 'vercel-light',
      },
    });
  } catch {
    html = `<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`;
  }
  return DOMPurify.sanitize(html, {
    ALLOWED_ATTR: ['class', 'style', 'tabindex'],
    ALLOWED_TAGS: ['pre', 'code', 'span', 'div', 'br'],
  });
}
