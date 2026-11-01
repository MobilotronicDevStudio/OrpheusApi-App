---
title: Overview and setup
description: Set up the assistant with a local or cloud model, and see what it can do.
---

The assistant is a chat panel on the right of the window. Toggle it with the **Assistant** button in the toolbar, or <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd>.

It works through a fixed set of tools inside Orpheus, the same way you would: it can read your collections, send requests, run collections and propose changes. It never gets your files, your secrets or a way to call an address you have not used. See [How your secrets stay safe](/OrpheusApi-App/docs/assistant/safety/).

## Choose a provider

Pick the provider and model in the chat header.

| Provider | What you need |
|---|---|
| Ollama | [Ollama](https://ollama.com) running on your computer, and a model that supports tools. No key, nothing leaves your machine. |
| Anthropic | An API key. |
| OpenAI | An API key. |
| Gemini | An API key. |

The model list shows each model's context size and, where Orpheus knows it, its price or free tier. Models that cannot use tools are marked, since the assistant needs them.

### API keys

Enter keys in **Assistant settings** (the sliders icon in the chat header). A key is encrypted by your operating system (DPAPI on Windows, the Keychain on macOS, libsecret or KWallet on Linux) and is never shown again or sent to the window.

You can also set a key with an environment variable before starting Orpheus:

| Provider | Variable |
|---|---|
| Anthropic | `ANTHROPIC_API_KEY` |
| OpenAI | `OPENAI_API_KEY` |
| Gemini | `GEMINI_API_KEY` or `GOOGLE_API_KEY` |

### Ollama settings

In **Assistant settings** you can change the Ollama address (default `http://127.0.0.1:11434`) and the context size. Larger contexts let the assistant keep more of a long response in view, at the cost of memory and speed.

## Approval mode

**Before running requests** has two choices:

- **Ask me every time** (the default): every send and every collection run shows a card with the request, its host and the environment. You approve or deny it.
- **Run without asking**: runs go ahead, and you still see each one in the chat.

Proposed edits to requests and scripts follow the same setting. Deleting a request always asks.

## What it can do

| Area | Tools |
|---|---|
| Read | List collections and environments, show a request, show the last response, read part of a large body, show the last collection run. Collections list their execution plans and invariant suites, with variable and rule names but not values. Show how variables pass between a collection's requests, and show a suite or plan in full: a plan's variables and data by name only. |
| Run | Send a saved request, run a collection or folder, run a saved execution plan, explore a saved [invariant suite](/OrpheusApi-App/docs/guides/invariant-testing/#with-the-assistant). |
| Write | Change a request, create a request or folder, move a request, delete a request, set or remove variables. Create or change an [execution plan](/OrpheusApi-App/docs/guides/execution-plans/#with-the-assistant) or an [invariant suite](/OrpheusApi-App/docs/guides/invariant-testing/#with-the-assistant). |
| Tests | Infer a JSON Schema from a real response, to write a contract test. |

Things to try:

- "Run the orders folder and tell me what failed."
- "Why did Create order return 422?"
- "Write tests for this response."
- "Add a contract test for List open orders."

The buttons above a response (**Write tests for this**, **Add a contract test**) and **Analyse this run** in the collection runner start these conversations for you.
