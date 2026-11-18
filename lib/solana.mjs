// Solana mint read via public JSON-RPC. No key, no signing.
// Mint layout (82 bytes): mintAuthority option(4)+pubkey(32), supply(8),
// decimals(1), isInitialized(1), freezeAuthority option(4)+pubkey(32).
const RPC = 'https://api.mainnet-beta.solana.com';
export async function readMint(mint, fetchFn = fetch) {
  try {
    const res = await fetchFn(RPC, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getAccountInfo', params: [mint, { encoding: 'base64' }] }), signal: AbortSignal.timeout(8000) });
    const j = await res.json();
    const b64 = j?.result?.value?.data?.[0];
    if (!b64) return { mintAuthority: null, freezeAuthority: null, source: 'solana-rpc', note: 'account-not-found-or-no-data' };
    const buf = Buffer.from(b64, 'base64');
    if (buf.length < 82) return { mintAuthority: null, freezeAuthority: null, source: 'solana-rpc', note: 'mint-layout-too-short' };
    const mintOpt = buf.readUInt32LE(0);
    const freezeOpt = buf.readUInt32LE(36 + 8 + 1 + 1);
    return {
      mintAuthority: mintOpt === 1 ? buf.subarray(4, 36).toString('hex') : false,
      freezeAuthority: freezeOpt === 1 ? buf.subarray(50, 82).toString('hex') : false,
      source: 'solana-rpc',
    };
  } catch (e) { return { mintAuthority: null, freezeAuthority: null, source: 'solana-rpc', note: `rpc-error:${String(e?.message || e).slice(0, 80)}` }; }
}
// DexScreener public API, no key. Returns best pair by liquidity.
export async function dexPairs(mint, fetchFn = fetch) {
  try {
    const res = await fetchFn(`https://api.dexscreener.com/latest/dex/tokens/${encodeURIComponent(mint)}`, { signal: AbortSignal.timeout(8000) });
    const j = await res.json();
    const all = Array.isArray(j?.pairs) ? j.pairs : [];
    // DexScreener returns pairs where the mint is base OR quote. Only
    // base-token pairs price THIS token; quote pairs (e.g. PUMP/USDC)
    // would report the other token's price. Filter to base first.
    const pairs = all.filter((p) => String(p?.baseToken?.address || '').toLowerCase() === mint.toLowerCase());
    if (!pairs.length) return { pair: null, source: 'dexscreener', note: 'no-base-pair' };
    pairs.sort((a, b) => (b?.liquidity?.usd || 0) - (a?.liquidity?.usd || 0));
    const p = pairs[0];
    return { pair: { dexId: p.dexId, pairAddress: p.pairAddress, priceUsd: p.priceUsd ? Number(p.priceUsd) : null, liquidityUsd: p?.liquidity?.usd ?? null, priceChangeH24: p?.priceChange?.h24 ?? null, volumeH24: p?.volume?.h24 ?? null, fdv: p?.fdv ?? null, marketCap: p?.marketCap ?? null, pairCreatedAt: p?.pairCreatedAt ?? null, baseSymbol: p?.baseToken?.symbol ?? null, quoteSymbol: p?.quoteToken?.symbol ?? null }, source: 'dexscreener' };
  } catch (e) { return { pair: null, source: 'dexscreener', note: `api-error:${String(e?.message || e).slice(0, 80)}` }; }
}
