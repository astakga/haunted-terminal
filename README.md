# Haunted Terminal — Kiroween 2026, Costume Contest

The graveyard for crypto tokens. Paste a Solana mint or a BNB address
and the token gets a grave: alive tokens glow, haunted ones flicker,
dead ones get a tombstone — and the spooky visuals *mean* something.

## The visual encoding (why the costume is functional)
- **Tombstone height** = holder concentration. Taller grave = more
  concentrated = one seller can kill it. (Unknown → medium, labelled
  unverified.)
- **Glow** = liquidity depth. Brighter = deeper market.
- **Aura colour** = 0–100 score. Green ALIVE (≥70), amber HAUNTED
  (40–69), grey DEAD (<40). Fog = unverified, never a fake value.

## Run
```sh
node app/server.mjs   # http://localhost:3000
node mcp-server/server.mjs   # MCP stdio server
npm test
```

## What it checks
- **The Grave (Solana audit)** — mint/freeze authority via public Solana
  RPC, pairs/price/liquidity/volume via DexScreener, 0–100 score.
- **The Seance (BNB Agent ID)** — `balanceOf` on SPACE ID Agent ID
  `0x60b9262456de011f7d15a54cdd8c48baaa8b022f` via public BSC RPC.
- **Ticker from Beyond (market)** — price, 24h change, volume,
  liquidity, market cap / FDV, source + fetch time on every number.
- **MCP** — tools `audit_token`, `lookup_agent_id`, `market_quote`,
  same `lib/` functions as the web API.

## Rules
Read-only, no wallet, no signing, no private keys, no trading / auto-buy.
If a source returns nothing, the UI shows `unverified` — never a fake
value. Trading views carry a risk warning. No promise of returns.

## How Kiro was used
- **Spec-driven**: `.kiro/specs/haunted-terminal/` — requirements, design,
  tasks. Every task maps to a requirement ID.
- **Steering**: `.kiro/steering/` — product (no-custody, no invented data,
  visuals must encode risk), tech (Node 22, zero-dep), structure.
- **Hooks**: `.kiro/hooks/hooks.json` — on save, `node --check` + tests.
- **MCP**: `.kiro/settings/mcp.json` registers this project's own MCP
  server, so Kiro itself can call `audit_token` while building.
- **PBT**: score function tested with 500 random inputs.

Built new for Kiroween 2026 (submission period 30 Oct – 4 Dec 2026).

## License
MIT — see LICENSE.
