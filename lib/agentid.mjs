// BNB Agent ID: eth_call balanceOf(address) on SPACE ID Agent ID.
// Contract 0x60b9262456de011f7d15a54cdd8c48baaa8b022f, ERC-721 non-transferable.
export const AGENT_ID_CONTRACT = '0x60b9262456de011f7d15a54cdd8c48baaa8b022f';
const RPCS = ['https://bsc-dataseed.binance.org/', 'https://bsc-dataseed1.bnbchain.org/'];
export function isBnbAddress(s) { return /^0x[0-9a-fA-F]{40}$/.test(String(s || '').trim()); }
export async function lookupAgentId(address, fetchFn = fetch) {
  const addr = String(address).trim();
  if (!isBnbAddress(addr)) return { address: addr, holdsAgentId: null, source: 'bsc-rpc', note: 'not-a-bnb-address' };
  const data = '0x70a08231' + '000000000000000000000000' + addr.slice(2).toLowerCase();
  for (const rpc of RPCS) {
    try {
      const res = await fetchFn(rpc, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to: AGENT_ID_CONTRACT, data }, 'latest'] }), signal: AbortSignal.timeout(8000) });
      const j = await res.json();
      if (typeof j?.result !== 'string') continue;
      const bal = BigInt(j.result);
      return { address: addr, holdsAgentId: bal > 0n, balance: bal.toString(), contract: AGENT_ID_CONTRACT, source: 'bsc-rpc' };
    } catch { /* try next RPC */ }
  }
  return { address: addr, holdsAgentId: null, contract: AGENT_ID_CONTRACT, source: 'bsc-rpc', note: 'rpc-unreachable' };
}
