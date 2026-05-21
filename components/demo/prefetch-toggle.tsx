import { cookies } from 'next/headers';
import { PrefetchToggleClient } from './prefetch-toggle-client';

export async function PrefetchToggle() {
  const store = await cookies();
  const enabled = !store.has('no-prefetch');
  return <PrefetchToggleClient enabled={enabled} />;
}
