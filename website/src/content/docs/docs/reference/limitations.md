---
title: Known limitations
description: What Orpheus does not do yet, so you know before you file an issue.
---

Orpheus is in alpha. These are known, and most are on the list.

- **Credentials are stored as plain text.** Passwords, tokens and secret variables in collections and environments are written to their JSON files unencrypted. Assistant API keys are the exception: they are encrypted by your operating system.
- **Builds are not signed.** Your system will ask you to confirm the first launch. See [Install](/OrpheusApi-App/docs/getting-started/install/#the-first-launch).
- **No auto-update.** New versions mean a new download.
- **Responses over 20 MB fail.** Raise the limit in a request's **Options** tab, or with `--max-response-size` on the command line.
- **No request history.** A response lives in its tab and is gone when you close it.
- **Postman scripts are not converted.** Imported Postman collections keep their requests but not their `pm` scripts.

Found something else? [Open an issue](https://github.com/MobilotronicDevStudio/OrpheusApi-App/issues).
