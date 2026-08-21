/** Narrow a bound server action for use as a progressive-enhancement <form action>. */
export function formAction<A extends unknown[]>(
  action: (...args: [...A, ...unknown[]]) => Promise<unknown>,
  ...args: A
): (formData: FormData) => Promise<void> {
  return action.bind(null, ...args) as (formData: FormData) => Promise<void>;
}
