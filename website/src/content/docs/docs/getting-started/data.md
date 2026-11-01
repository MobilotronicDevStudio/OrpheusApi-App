---
title: Where your data lives
description: Every file Orpheus writes, and where to find it.
---

Orpheus keeps everything on your computer. There is no account and no cloud sync.

## The data folder

Most files live in a `data` folder inside the app's user data folder:

| System | User data folder |
|---|---|
| Windows | `%APPDATA%\Orpheus API` |
| macOS | `~/Library/Application Support/Orpheus API` |
| Linux | `~/.config/Orpheus API` |

## What is in it

| File | What it holds |
|---|---|
| `data/collections.json` | The list of open collections and where each file is. |
| `data/collections/` | Collections that were created or imported without a chosen location. |
| `data/environments.json` | The list of environments and which one is selected. |
| `data/environments/` | One JSON file per environment. |
| `data/globals.json` | Global variables. |
| `data/cookies.json` | The cookie jar. |
| `data/session.json` | Open tabs, so they come back after a restart. |
| `data/assistant-settings.json` | Assistant provider, model and approval mode. |
| `data/assistant-keys.json` | Provider API keys, encrypted by your operating system. |
| `data/assistant-known-origins.json` | Hosts you have sent requests to, used by the [egress check](/OrpheusApi-App/docs/assistant/safety/#no-new-destinations). |

A collection you saved to a location of your choice stays there. Orpheus only remembers its path.

## Keeping collections in git

Collections and environments are formatted JSON, so they diff well and can live next to your code.

:::caution
Credentials you type into a collection or environment, such as passwords, bearer tokens and secret variables, are stored in those files as plain text. Check a file before you commit or share it.
:::
