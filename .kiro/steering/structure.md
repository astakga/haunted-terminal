# Structure steering — Haunted Terminal

- `.kiro/specs/haunted-terminal/` — requirements.md, design.md, tasks.md.
- `.kiro/steering/` — product.md, tech.md, structure.md (this file).
- `.kiro/hooks/hooks.json` — save hook: typecheck + tests.
- `.kiro/settings/mcp.json` — registers this project's MCP server.
- `app/` — UI + zero-dep Node server. `mcp-server/` — MCP stdio.
- `lib/` — shared pure service functions. `test/` — unit + PBT.
- Do NOT add `.kiro/` to `.gitignore`. It must be committed.
