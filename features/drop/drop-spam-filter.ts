/* eslint-disable no-console */
import 'server-only';

import { createGateway } from '@ai-sdk/gateway';
import { generateText, Output } from 'ai';
import { z } from 'zod';

const gateway = createGateway({ apiKey: process.env.VERCEL_AI_GATEWAY_TOKEN });

const SPAM_MODEL = 'google/gemini-2.5-flash-lite';

const verdictSchema = z.object({
  allowed: z.boolean(),
  reason: z.string().optional(),
});

const SYSTEM = `You are a content moderator for a short-form social app called Drop.
Decide whether a single post may be published.
Block spam, scams, phishing, mass advertising, harassment, threats, and hate speech.
Allow ordinary posts, opinions, jokes, criticism, and mild profanity.
Set allowed=false only when you are confident the post violates these rules.
The reason is shown to the author who is trying to publish, so address them and say why their post can't go up (e.g. "This reads as a crypto scam, so it can't be published"). Never warn or address the reader, and don't imply the author is the victim — the author is the one being blocked.`;

// Returns a user-facing error message if the post should be blocked, or null if it's fine.
// Fails open: a gateway outage or timeout never blocks posting — the regex filter is the hard gate.
export async function moderateWithAI(body: string): Promise<string | null> {
  console.log('[spam-filter] token present:', Boolean(process.env.VERCEL_AI_GATEWAY_TOKEN), '| model:', SPAM_MODEL);
  try {
    const { output } = await generateText({
      abortSignal: AbortSignal.timeout(3000),
      model: gateway(SPAM_MODEL),
      output: Output.object({ schema: verdictSchema }),
      prompt: body,
      system: SYSTEM,
    });
    console.log('[spam-filter] verdict:', output);
    return output.allowed ? null : (output.reason ?? 'That post looks like spam — try rewording it.');
  } catch (error) {
    console.error('[spam-filter] failed — failing open:', error);
    return null;
  }
}
