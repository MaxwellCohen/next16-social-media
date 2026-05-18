import "server-only";

import { cache } from "react";
import {
  createCssVariablesTheme,
  createHighlighter,
  type Highlighter,
} from "shiki";

const SUPPORTED_LANGS = [
  "tsx",
  "ts",
  "jsx",
  "js",
  "bash",
  "shell",
  "json",
  "css",
  "html",
  "md",
] as const;

export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const cssTheme = createCssVariablesTheme({
  name: "drop",
  variablePrefix: "--shiki-",
  variableDefaults: {},
  fontStyle: true,
});

/**
 * Shiki highlighter, lazy-loaded once per process. Uses a CSS-variable theme
 * so a single rendered HTML works for both light and dark mode (the variables
 * are defined in globals.css and switch on `.dark`).
 */
export const getHighlighter = cache(async (): Promise<Highlighter> => {
  const highlighter = await createHighlighter({
    themes: [cssTheme],
    langs: SUPPORTED_LANGS as unknown as string[],
  });
  return highlighter;
});

export function normalizeLang(lang: string | undefined): SupportedLang {
  const l = (lang ?? "").toLowerCase();
  if ((SUPPORTED_LANGS as readonly string[]).includes(l)) {
    return l as SupportedLang;
  }
  if (l === "sh" || l === "zsh") return "bash";
  if (l === "typescript") return "ts";
  if (l === "javascript") return "js";
  if (l === "markdown") return "md";
  return "bash";
}

export async function highlight(code: string, lang: string | undefined) {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code, {
    lang: normalizeLang(lang),
    theme: "drop",
  });
}
