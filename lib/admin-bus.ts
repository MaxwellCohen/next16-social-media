import { EventEmitter } from 'node:events';
import type { ActivityKind } from '@/types/admin';

export type ActivityEvent = {
  kind: ActivityKind;
  actorHandle: string;
  dropId?: string;
  preview?: string;
  at: number;
};

const ACTIVITY = 'activity';

const globalForBus = globalThis as unknown as { adminBus?: EventEmitter };

const bus =
  globalForBus.adminBus ??
  (() => {
    const emitter = new EventEmitter();
    emitter.setMaxListeners(0);
    return emitter;
  })();

globalForBus.adminBus = bus;

export function publishActivity(event: Omit<ActivityEvent, 'at'>) {
  bus.emit(ACTIVITY, { ...event, at: Date.now() } satisfies ActivityEvent);
}

export function onActivity(listener: (event: ActivityEvent) => void) {
  bus.on(ACTIVITY, listener);
  return () => bus.off(ACTIVITY, listener);
}
