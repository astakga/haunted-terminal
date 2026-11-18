// Haunted Terminal MCP server (stdio). Tools reuse lib/verdict.mjs —
// the same functions as the web API, no logic fork.
import { verdict } from '../lib/verdict.mjs';
import { lookupAgentId } from '../lib/agentid.mjs';
const tools = [
  { name: 'audit_token', description: 'Audit a Solana token: score, state ALIVE/HAUNTED/DEAD, mint/freeze authority, market data.', inputSchema: { type: 'object', properties: { mint: { type: 'string' } }, required: ['mint'] } },
  { name: 'lookup_agent_id', description: 'Check whether a BNB address holds a SPACE ID Agent ID (balanceOf).', inputSchema: { type: 'object', properties: { address: { type: 'string' } }, required: ['address'] } },
  { name: 'market_quote', description: 'Market quote for a Solana token from DexScreener.', inputSchema: { type: 'object', properties: { mint: { type: 'string' } }, required: ['mint'] } },
];
let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', async (chunk) => {
  buf += chunk;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i).trim(); buf = buf.slice(i + 1);
    if (!line) continue;
    let msg; try { msg = JSON.parse(line); } catch { continue; }
    const out = await handle(msg);
    if (out) process.stdout.write(JSON.stringify(out) + '\n');
  }
});
async function handle(msg) {
  const { id, method, params } = msg;
  if (method === 'initialize') return { jsonrpc: '2.0', id, result: { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'haunted-terminal', version: '0.1.0' } } };
  if (method === 'tools/list') return { jsonrpc: '2.0', id, result: { tools } };
  if (method === 'tools/call') {
    const name = params?.name; const args = params?.arguments || {};
    try {
      let data;
      if (name === 'audit_token') data = await verdict(args.mint);
      else if (name === 'lookup_agent_id') data = await lookupAgentId(args.address);
      else if (name === 'market_quote') { const v = await verdict(args.mint); data = v.market || { note: 'no-market-data' }; }
      else throw new Error('unknown tool: ' + name);
      return { jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] } };
    } catch (e) { return { jsonrpc: '2.0', id, error: { code: -32603, message: String(e?.message || e) } }; }
  }
  if (method === 'notifications/initialized') return null;
  return { jsonrpc: '2.0', id, error: { code: -32601, message: 'method not found' } };
}
