'use client';

import { addTransitionType, startTransition, useEffect, useRef, useState } from 'react';
import type { AdminSnapshot, ServerMessage } from '@/types/admin';

const WS_PATH = '/api/admin';
const MAX_ACTIVITY = 150;
const BASE_DELAY_MS = 1000;
const MAX_DELAY_MS = 15_000;
const FLASH_MS = 1500;

export function useAdminSocket() {
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null);
  const [flashIds, setFlashIds] = useState<Set<string>>(() => new Set());
  const socketRef = useRef<WebSocket | null>(null);
  const seededRef = useRef(false);

  useEffect(() => {
    let attempts = 0;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    const flashTimers: ReturnType<typeof setTimeout>[] = [];
    let closed = false;

    function flash(id: string) {
      setFlashIds(prev => new Set(prev).add(id));
      flashTimers.push(
        setTimeout(() => {
          setFlashIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, FLASH_MS),
      );
    }

    function apply(message: ServerMessage) {
      if (message.type === 'snapshot') {
        if (seededRef.current) {
          setSnapshot(message.snapshot);
        } else {
          seededRef.current = true;
          startTransition(() => {
            addTransitionType('admin-reveal');
            setSnapshot(message.snapshot);
          });
        }
      } else if (message.type === 'presence') {
        setSnapshot(prev => (prev ? { ...prev, presence: message.presence } : prev));
      } else {
        flash(message.item.id);
        startTransition(() => {
          setSnapshot(prev => {
            if (!prev || prev.recentActivity.some(item => item.id === message.item.id)) return prev;
            const recentActivity = [message.item, ...prev.recentActivity].slice(0, MAX_ACTIVITY);
            const bumped = message.item.kind === 'drop' || message.item.kind === 'reply';
            return {
              ...prev,
              dropsLastMinute: bumped ? prev.dropsLastMinute + 1 : prev.dropsLastMinute,
              recentActivity,
            };
          });
        });
      }
    }

    function connect() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}${WS_PATH}`);
      socketRef.current = ws;

      ws.onmessage = event => {
        try {
          apply(JSON.parse(event.data) as ServerMessage);
        } catch {
          return;
        }
      };
      ws.onclose = () => {
        socketRef.current = null;
        if (closed) return;
        attempts += 1;
        const delay = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** (attempts - 1));
        reconnectTimer = setTimeout(connect, delay);
      };
      ws.onerror = () => {
        ws.close();
      };
    }

    if (window.location.pathname.startsWith('/admin')) connect();

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      flashTimers.forEach(clearTimeout);
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);

  return { flashIds, snapshot };
}
