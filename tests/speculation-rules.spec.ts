import { test, expect } from '@playwright/test';

test.describe('Speculation rules', () => {
  test('advertise rules via header only when scripts are disabled', async ({ request }) => {
    const withScripts = await request.get('/');
    expect(withScripts.headers()['speculation-rules']).toBeUndefined();

    const withoutScripts = await request.get('/', {
      headers: { cookie: 'no-scripts=1' },
    });
    expect(withoutScripts.headers()['speculation-rules']).toBe('"/speculationrules.json"');

    const rulesRes = await request.get('/speculationrules.json');
    expect(rulesRes.headers()['content-type']).toContain('application/speculationrules+json');
    const body = await rulesRes.json();
    expect(body.prefetch?.[0]?.eagerness).toBe('eager');
    expect(body.prerender?.[0]?.eagerness).toBe('moderate');
  });
});
