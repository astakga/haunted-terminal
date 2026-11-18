# Tasks — Haunted Terminal

- [x] T-1 Scaffold repo: MIT LICENSE, README, `.gitignore` (must NOT ignore `.kiro/`). [REQ-5]
- [x] T-2 `lib/score.mjs`: pure 0–100 score + tombstone height. [REQ-1, REQ-3]
- [x] T-3 `lib/solana.mjs` + `lib/agentid.mjs`: mint read, DexScreener, balanceOf. [REQ-1, REQ-2]
- [x] T-4 `lib/verdict.mjs`: one-query verdict, sources + warnings. [REQ-1, REQ-3]
- [x] T-5 `app/server.mjs` + `app/index.html`: graveyard UI, 3 cards, visual encoding. [REQ-1, REQ-2]
- [x] T-6 Property-based tests (500 cases) + unit tests. [REQ-1]
- [x] T-7 `mcp-server/server.mjs`: MCP tools reusing `lib/`. [REQ-4]
- [x] T-8 Live verify: run server, test USDC + BONK + BNB address, screenshot headless Chrome. DONE 19 Nov ~03:44 WIB: Playwright Chromium 159 installed after 2 failed attempts (CDN download failure + VM restart wiped /tmp); screenshots in screenshots/ (01-home, 02-bonk-alive); fixed tomb label (ALIVE token no longer shows R.I.P.).
- [ ] T-9 Demo video <3 min, deployed link, Devpost write-up (Kiro use: spec, hooks, steering, MCP, PBT).
