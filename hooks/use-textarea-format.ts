import type { RefObject } from 'react';

export function useTextareaFormat(ref: RefObject<HTMLTextAreaElement | null>) {
  function insertAtCaret(text: string, caretFromEnd = 0) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    el.value = value.slice(0, start) + text + value.slice(end);
    const caret = start + text.length - caretFromEnd;
    el.focus();
    el.setSelectionRange(caret, caret);
    el.dispatchEvent(new Event('input', { bubbles: true }));
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
    const { selectionStart: start, selectionEnd: end, value } = el;
    const selected = value.slice(start, end);
    el.value = value.slice(0, start) + marker + selected + marker + value.slice(end);
    const innerStart = start + marker.length;
    el.focus();
    el.setSelectionRange(innerStart, innerStart + selected.length);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  return { insertAtCaret, insertSnippet, wrapSelection };
}
