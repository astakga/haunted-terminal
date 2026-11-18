# Design — Haunted Terminal

## Architecture
```
User / LLM agent
  ├─ Web UI (single HTML file, dark graveyard theme) ──► /api/verdict (Node, zero-dep)
  │     ├─ Solana audit: public RPC (mint layout) + DexScreener pairs
  │     ├─ BNB Agent ID: eth_call balanceOf on 0x60b9…022f (public BSC RPC)
  │     └─ Market: DexScreener (price, 24h, volume, liquidity, cap)
  └─ MCP server (Node, stdio) ──► same lib/verdict.mjs as the web API
        tools: audit_token, lookup_agent_id, market_quote
```

## Visual encoding (the Costume Contest argument)
| Visual | Meaning | Why it helps |
|---|---|---|
| Tombstone height | Holder concentration | Tall grave = concentrated = one seller can kill it |
| Glow | Liquidity depth | Bright grave = deep market, dim = thin |
| Aura colour | Score band | Green/amber/grey readable in <1s, no reading required |
| Fog / 🌫️ | Unverified | Missing data is visible as fog, not hidden |

## Components
- `app/index.html` — one screen, 3 cards (Grave / Seance / Ticker), one
  search box, sample buttons (USDC, BONK, BNB address).
- `app/server.mjs` — Node 22, zero deps, static + `/api/verdict`, 60s cache.
- `lib/score.mjs` — pure score + tombstone height, property-tested.
- `lib/solana.mjs`, `lib/agentid.mjs`, `lib/verdict.mjs` — network at edge.
- `mcp-server/server.mjs` — MCP stdio, same lib.
- `test/score.test.mjs` — unit + 500-case property test.

## Kiro usage
- Spec-driven: this spec + `tasks.md` drove the build.
- Steering: `.kiro/steering/` — product (no-custody, no invented data),
  tech (Node 22, zero-dep), structure.
- Hooks: save hook runs `node --check` + tests.
- MCP: `.kiro/settings/mcp.json` registers this project's own MCP server.
- PBT: score tested with 500 random holder/liquidity inputs.
