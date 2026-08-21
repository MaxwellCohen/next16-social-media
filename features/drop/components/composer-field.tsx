'use client';

import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { ClientOnly } from '@/components/ui/client-only';
import { ToolbarButton } from '@/features/drop/components/composer-toolbar';

type Props = {
  avatar: React.ReactNode;
  placeholder: string;
  autoFocus?: boolean;
  onRemove?: () => void;
  onFocus?: (el: HTMLTextAreaElement) => void;
};

export function ComposerField({ avatar, placeholder, autoFocus, onRemove, onFocus }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) ref.current?.focus();
  }, [autoFocus]);

  return (
    <div className="flex items-start gap-3">
      {avatar}
      <div className="relative flex min-w-0 flex-1">
        <textarea
          name="body"
          ref={ref}
          data-autofocus={autoFocus ? true : undefined}
          maxLength={1000}
          rows={3}
          aria-label="Drop body"
          placeholder={placeholder}
          onFocus={e => onFocus?.(e.currentTarget)}
          onKeyDown={e => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
          className="placeholder-gray field-sizing-content min-h-24 w-full resize-none border-0 bg-transparent pt-1.5 pr-9 text-base leading-relaxed focus:ring-0 focus:outline-none"
        />
        {onRemove ? (
          <div className="absolute top-0 right-0">
            <ClientOnly>
              <ToolbarButton size="sm" label="Remove drop" onClick={onRemove}>
                <X className="h-4 w-4" />
              </ToolbarButton>
            </ClientOnly>
          </div>
        ) : null}
      </div>
    </div>
  );
}
