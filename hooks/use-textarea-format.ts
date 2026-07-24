import type { RefObject } from 'react';

export function useTextareaFormat(ref: RefObject<HTMLTextAreaElement | null>) {
  function insertAtCaret(text: string, caretFromEnd = 0) {
    const el = ref.current;
    if (!el) return;
    el.focus();
    document.execCommand('insertText', false, text);
    const caret = el.selectionStart - caretFromEnd;
    el.setSelectionRange(caret, caret);
  }

  function insertSnippet() {
    const el = ref.current;
    if (!el) return;
    const { selectionStart } = el;
    const lead = selectionStart > 0 && el.value[selectionStart - 1] !== '\n' ? '\n' : '';
    insertAtCaret(`${lead}\`\`\`ts\n\n\`\`\`\n`, 5);
  }

  function wrapSelection(marker: string) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = el.value.slice(start, end);
    el.focus();
    document.execCommand('insertText', false, marker + selected + marker);
    const innerStart = start + marker.length;
    el.setSelectionRange(innerStart, innerStart + selected.length);
  }

  return { insertAtCaret, insertSnippet, wrapSelection };
}
