import { scoreToken, tombstoneHeightPx } from './score.mjs';
import { readMint, dexPairs } from './solana.mjs';
import { lookupAgentId, isBnbAddress } from './agentid.mjs';

export async function verdict(input, fetchFn = fetch) {
  const q = String(input || '').trim();
  const fetchedAt = new Date().toISOString();
  const sources = [];
  const warnings = [];
  if (!q) return { input: q, fetchedAt, error: 'empty-input' };

  // BNB address -> Agent ID seance only (no Solana pair for it).
  if (isBnbAddress(q)) {
    const agentId = await lookupAgentId(q, fetchFn);
    sources.push(agentId.source);
    return { input: q, chain: 'bnb', kind: 'agent-id', agentId, audit: null, market: null, sources, fetchedAt, warnings };
  }
  // Otherwise treat as a Solana mint.
  const [mint, dex] = await Promise.all([readMint(q, fetchFn), dexPairs(q, fetchFn)]);
  sources.push(mint.source, dex.source);
  const pair = dex.pair;
  const pairAgeHours = pair?.pairCreatedAt ? (Date.now() - pair.pairCreatedAt) / 3600000 : null;
  const audit = scoreToken({
    mintAuthority: mint.mintAuthority === false ? false : mint.mintAuthority ? true : null,
    freezeAuthority: mint.freezeAuthority === false ? false : mint.freezeAuthority ? true : null,
    liquidityUsd: pair?.liquidityUsd ?? null, hasPair: !!pair,
    priceChangeH24: pair?.priceChangeH24 ?? null, pairAgeHours,
  });
  const market = pair ? { symbol: pair.baseSymbol, priceUsd: pair.priceUsd, priceChangeH24: pair.priceChangeH24, volumeH24: pair.volumeH24, liquidityUsd: pair.liquidityUsd, fdv: pair.fdv, marketCap: pair.marketCap, dexId: pair.dexId, pairAddress: pair.pairAddress, source: 'dexscreener' } : null;
  if (!pair) warnings.push('No DEX pair found — token may be dead, unlisted, or the address is not a Solana mint.');
  if (mint.note) warnings.push(`Mint read: ${mint.note}`);
  if (audit.unknown.length) warnings.push(`Unverified fields: ${audit.unknown.join(', ')} — score confidence ${audit.confidence}.`);
  return { input: q, chain: 'solana', kind: 'token', audit: { ...audit, mintAuthority: mint.mintAuthority, freezeAuthority: mint.freezeAuthority, tombstoneHeightPx: tombstoneHeightPx(null) }, market, agentId: null, sources, fetchedAt, warnings };
}
