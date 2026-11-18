# Requirements — Haunted Terminal (Kiroween 2026, Costume Contest)

New project, built 2026-11-19 – 2026-12-04. No code from before 2026-10-30
is submitted as new work.

## Problem
Crypto audit tools look like spreadsheets. Risk is invisible until it is
too late. A trader should *see* a token's state at a glance: alive,
haunted, or dead — and *why*, without opening four tabs.

## Design rule (Costume Contest)
Spooky elements must enhance function, not decorate it:
- Tombstone height = holder concentration (taller = riskier).
- Glow intensity = liquidity depth (brighter = deeper).
- Aura colour = 0–100 score: green ALIVE (≥70), amber HAUNTED (40–69),
  grey DEAD (<40). Fog = unverified, never a fake value.

## User stories (EARS)

### REQ-1 — One-query verdict
WHEN a user pastes a Solana mint
THEN the system SHALL return a 0–100 score, ALIVE/HAUNTED/DEAD state,
mint/freeze authority, liquidity, price, 24h change, volume, with every
number labelled by source + fetch time, using only public read-only APIs.

### REQ-2 — Agent ID seance
WHEN a user pastes a BNB 0x address
THEN the system SHALL report whether it holds an Agent ID via
`balanceOf` on `0x60b9262456de011f7d15a54cdd8c48baaa8b022f`.

### REQ-3 — Unverified, never invented
WHEN a source returns nothing
THEN the system SHALL show `unverified` / fog, and list the missing
fields, instead of inventing a value.

### REQ-4 — MCP for agents
WHEN an LLM agent connects via MCP
THEN the system SHALL expose `audit_token`, `lookup_agent_id` and
`market_quote`, reusing the same `lib/` functions as the web UI.

### REQ-5 — No-cost, no-custody
WHEN the app runs
THEN it SHALL NOT require a wallet, signing, payment, or gas; all calls
are public read-only. Trading views carry a risk warning.
