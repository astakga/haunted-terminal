// Haunted Terminal — zero-dependency Node server. Serves the UI + /api/verdict.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { verdict } from '../lib/verdict.mjs';
const root = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const cache = new Map();
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  res.setHeader('x-haunted-terminal', 'kiroween-2026');
  if (url.pathname === '/api/verdict') {
    const q = url.searchParams.get('q') || '';
    const key = q.toLowerCase();
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < 60_000) { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ ...hit.v, cached: true })); return; }
    try {
      const v = await verdict(q);
      cache.set(key, { v, at: Date.now() });
      res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(v));
    } catch (e) { res.statusCode = 500; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ error: String(e?.message || e) })); }
    return;
  }
  const file = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\//, '');
  if (!/^[a-z0-9._-]+$/i.test(file) || file.includes('..')) { res.statusCode = 404; res.end('not found'); return; }
  try {
    const body = await readFile(path.join(root, file));
    res.setHeader('content-type', file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'text/javascript' : 'text/html');
    res.end(body);
  } catch { res.statusCode = 404; res.end('not found'); }
});
server.listen(PORT, () => console.log(`Haunted Terminal on http://localhost:${PORT}`));
