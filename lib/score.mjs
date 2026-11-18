// Pure scoring — no network, fully testable.
// Signals are labelled; missing signals do NOT invent a value, they
// reduce confidence instead. Score 0-100, higher = safer-looking.
export function scoreToken({ mintAuthority = null, freezeAuthority = null, liquidityUsd = null, hasPair = false, priceChangeH24 = null, pairAgeHours = null } = {}) {
  let score = 100;
  const deductions = [];
  const unknown = [];
  if (!hasPair) { score -= 50; deductions.push('no-dex-pair:-50'); return finish(score, deductions, unknown); }
  if (mintAuthority === null) unknown.push('mintAuthority');
  else if (mintAuthority) { score -= 30; deductions.push('mint-authority-present:-30'); }
  if (freezeAuthority === null) unknown.push('freezeAuthority');
  else if (freezeAuthority) { score -= 20; deductions.push('freeze-authority-present:-20'); }
  if (liquidityUsd === null) unknown.push('liquidityUsd');
  else if (liquidityUsd < 10_000) { score -= 20; deductions.push('liquidity<10k:-20'); }
  else if (liquidityUsd < 100_000) { score -= 10; deductions.push('liquidity<100k:-10'); }
  if (priceChangeH24 === null) unknown.push('priceChangeH24');
  else if (priceChangeH24 <= -50) { score -= 10; deductions.push('h24<=-50%:-10'); }
  if (pairAgeHours === null) unknown.push('pairAgeHours');
  else if (pairAgeHours < 24) { score -= 5; deductions.push('pair<24h:-5'); }
  return finish(score, deductions, unknown);
}
function finish(score, deductions, unknown) {
  score = Math.max(0, Math.min(100, score));
  const state = score >= 70 ? 'ALIVE' : score >= 40 ? 'HAUNTED' : 'DEAD';
  return { score, state, deductions, unknown, confidence: unknown.length === 0 ? 'high' : unknown.length <= 2 ? 'medium' : 'low' };
}
export function tombstoneHeightPx(top10SharePct = null) {
  // Taller tombstone = more concentrated holders = riskier.
  // Unknown concentration -> medium height, labelled unverified in UI.
  if (top10SharePct === null) return 90;
  return Math.round(60 + Math.min(100, top10SharePct) * 1.2);
}
