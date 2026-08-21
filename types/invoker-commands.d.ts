import 'react';

declare module 'react' {
  interface ButtonHTMLAttributes<T> {
    command?:
      | 'show-modal'
      | 'close'
      | 'request-close'
      | 'show-popover'
      | 'hide-popover'
      | 'toggle-popover'
      | (string & {});
    commandFor?: string;
  }
}

export {};
