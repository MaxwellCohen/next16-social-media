'use server';

import { isSlowEnabled } from '@/components/demo/demo-slow';
import { DropBody } from '@/features/drop/components/drop-body';
import { delay } from '@/lib/utils';

export async function renderDropPreview(body: string) {
  await delay(600, await isSlowEnabled());
  return <DropBody body={body} />;
}
