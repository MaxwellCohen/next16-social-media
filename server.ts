/* eslint-disable no-console */
import { createServer } from 'node:http';
import { parse } from 'node:url';
import next from 'next';
import { WebSocketServer, type WebSocket } from 'ws';
import '@/lib/load-env';
import { getAdminSnapshot } from '@/features/admin/admin-queries';
import { onActivity } from '@/lib/admin-bus';
import type { ServerMessage } from '@/types/admin';

const WS_PATH = '/api/admin';
const DEBOUNCE_MS = 250;
const HEARTBEAT_MS = 30_000;

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = Number(process.env.PORT) || 3000;

type PeerMeta = { handle: string; isAlive: boolean };

function parseHandle(cookieHeader: string | undefined): string {
  if (!cookieHeader) return 'anon';
  for (const part of cookieHeader.split(';')) {
    const [name, ...rest] = part.trim().split('=');
    if (name === 'drop-user') return decodeURIComponent(rest.join('=')) || 'anon';
  }
  return 'anon';
}

const app = next({ dev, hostname, port });

app.prepare().then(() => {
  const handle = app.getRequestHandler();
  const upgradeHandler = app.getUpgradeHandler();
  const server = createServer((req, res) => handle(req, res, parse(req.url || '', true)));

  const wss = new WebSocketServer({ noServer: true });
  const peers = new Map<WebSocket, PeerMeta>();

  function send(ws: WebSocket, message: ServerMessage) {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(message));
  }

  function broadcast(message: ServerMessage) {
    for (const ws of peers.keys()) send(ws, message);
  }

  function broadcastPresence() {
    broadcast({ presence: peers.size, type: 'presence' });
  }

  let debounce: NodeJS.Timeout | null = null;
  async function broadcastSnapshot() {
    try {
      const snapshot = await getAdminSnapshot();
      snapshot.presence = peers.size;
      broadcast({ snapshot, type: 'snapshot' });
    } catch (error) {
      console.error('[admin] snapshot failed', error);
    }
  }
  function scheduleSnapshot() {
    if (debounce) return;
    debounce = setTimeout(() => {
      debounce = null;
      void broadcastSnapshot();
    }, DEBOUNCE_MS);
  }

  onActivity(event => {
    broadcast({
      item: {
        actorHandle: event.actorHandle,
        at: event.at,
        id: event.dropId ?? `${event.kind}-${event.at}`,
        kind: event.kind,
        preview: event.preview,
      },
      type: 'activity',
    });
    scheduleSnapshot();
  });

  wss.on('connection', async (ws, request) => {
    peers.set(ws, { handle: parseHandle(request.headers.cookie), isAlive: true });
    ws.on('pong', () => {
      const meta = peers.get(ws);
      if (meta) meta.isAlive = true;
    });
    ws.on('close', () => {
      peers.delete(ws);
      broadcastPresence();
    });
    ws.on('error', () => {
      peers.delete(ws);
    });

    try {
      const snapshot = await getAdminSnapshot();
      snapshot.presence = peers.size;
      send(ws, { snapshot, type: 'snapshot' });
    } catch (error) {
      console.error('[admin] initial snapshot failed', error);
    }
    broadcastPresence();
  });

  server.on('upgrade', (request, socket, head) => {
    const { pathname } = parse(request.url || '');
    if (pathname === WS_PATH) {
      wss.handleUpgrade(request, socket, head, ws => {
        wss.emit('connection', ws, request);
      });
    } else {
      upgradeHandler(request, socket, head);
    }
  });

  const heartbeat = setInterval(() => {
    for (const [ws, meta] of peers) {
      if (!meta.isAlive) {
        ws.terminate();
        peers.delete(ws);
        continue;
      }
      meta.isAlive = false;
      ws.ping();
    }
  }, HEARTBEAT_MS);
  wss.on('close', () => clearInterval(heartbeat));

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}  (WebSocket: ${WS_PATH})`);
  });
});
