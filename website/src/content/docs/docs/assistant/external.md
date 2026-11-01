---
title: Use it from your editor
description: Let Claude Code, VS Code, Cursor or another MCP client use Orpheus's tools.
---

If you already use an AI assistant in your editor, it can use Orpheus too. Orpheus can expose the same tools the chat panel uses as a local [MCP](https://modelcontextprotocol.io) server.

## Turn it on

1. Open **Assistant settings**.
2. Under the external tools section, turn on **Allow connections**.
3. Copy the command or the JSON configuration shown, and add it to your tool.

The server listens on `http://127.0.0.1:47319/mcp` by default. You can change the port. It only runs while Orpheus is open.

## Who can connect

Three checks run before any request reaches the tools:

- it must be addressed to localhost, which blocks DNS rebinding from web pages;
- it must not come from a browser, so web pages cannot call it at all;
- it must carry the access token, so other programs on your computer cannot either.

The token is stored with your operating system's secure storage. **New access token** replaces it, after which you register your tools again with the new command.

## The same rules apply

Results are redacted exactly as they are for the chat panel, and runs follow the same approval setting. If you chose **Ask me every time**, approval cards appear in Orpheus while your editor waits.
