import 'server-only';

import { createGateway } from '@ai-sdk/gateway';
import { generateText, Output } from 'ai';
import { z } from 'zod';

const gateway = createGateway({ apiKey: process.env.VERCEL_AI_GATEWAY_TOKEN });

const SPAM_MODEL = 'moonshotai/kimi-k2';

const verdictSchema = z.object({
  allowed: z.boolean(),
  reason: z.string().optional(),
});

const SYSTEM = `You are a content moderator for a short-form social app called Drop.
Decide whether a single post may be published.
Block spam, scams, phishing, mass advertising, harassment, threats, and hate speech.
Allow ordinary posts, opinions, jokes, criticism, and mild profanity.
Set allowed=false only when you are confident the post violates these rules, and give a short, friendly reason.`;

// Returns a user-facing error message if the post should be blocked, or null if it's fine.
// Fails open: a gateway outage or timeout never blocks posting — the regex filter is the hard gate.
export async function moderateWithAI(body: string): Promise<string | null> {
  try {
    const { output } = await generateText({
      abortSignal: AbortSignal.timeout(3000),
      model: gateway(SPAM_MODEL),
      output: Output.object({ schema: verdictSchema }),
      prompt: body,
      system: SYSTEM,
    });
    return output.allowed ? null : (output.reason ?? 'That post looks like spam — try rewording it.');
  } catch {
    return null;
  }
}
