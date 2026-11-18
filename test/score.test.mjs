import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreToken, tombstoneHeightPx } from '../lib/score.mjs';

test('clean token scores high and is ALIVE', () => {
  const r = scoreToken({ mintAuthority: false, freezeAuthority: false, liquidityUsd: 500_000, hasPair: true, priceChangeH24: 5, pairAgeHours: 100 });
  assert.equal(r.score, 100); assert.equal(r.state, 'ALIVE');
});
test('mint + freeze authorities drag score to HAUNTED/DEAD', () => {
  const r = scoreToken({ mintAuthority: true, freezeAuthority: true, liquidityUsd: 5_000, hasPair: true, priceChangeH24: -60, pairAgeHours: 2 });
  assert.ok(r.score <= 25); assert.equal(r.state, 'DEAD');
});
test('no pair is the worst single signal', () => {
  const r = scoreToken({ hasPair: false });
  assert.equal(r.score, 50); assert.equal(r.state, 'HAUNTED');
});
test('unknown fields are labelled, never invented', () => {
  const r = scoreToken({ hasPair: true });
  assert.ok(r.unknown.includes('mintAuthority'));
  assert.ok(r.unknown.includes('liquidityUsd'));
  assert.equal(r.confidence, 'low');
});
test('property: score always in 0..100 for random inputs', () => {
  for (let i = 0; i < 500; i++) {
    const r = scoreToken({ mintAuthority: Math.random() < .5, freezeAuthority: Math.random() < .5, liquidityUsd: Math.random() * 1e6, hasPair: Math.random() < .8, priceChangeH24: (Math.random() - .5) * 200, pairAgeHours: Math.random() * 1000 });
    assert.ok(r.score >= 0 && r.score <= 100, `score ${r.score}`);
    assert.ok(['ALIVE', 'HAUNTED', 'DEAD'].includes(r.state));
  }
});
test('tombstone height grows with holder concentration', () => {
  assert.ok(tombstoneHeightPx(90) > tombstoneHeightPx(10));
  assert.equal(tombstoneHeightPx(null), 90);
});
