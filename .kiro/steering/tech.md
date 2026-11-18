# Tech steering — Haunted Terminal

- Node 22, zero runtime dependencies. No build step for the web UI.
- Pure, unit-testable functions in `lib/`; network only at the edge.
- 60s in-memory cache per key; 8s timeout per upstream; fail soft.
- No secrets in the repo. No API keys needed (public endpoints only).
- `node --check` + unit tests must pass before any commit.
