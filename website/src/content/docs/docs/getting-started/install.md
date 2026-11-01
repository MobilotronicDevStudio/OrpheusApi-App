---
title: Install
description: Download Orpheus for Windows, macOS or Linux.
---

Download the installer for your system from the [releases page](https://github.com/MobilotronicDevStudio/OrpheusApi-App/releases).

| System | File | Notes |
|---|---|---|
| Windows 10 and 11 | `.exe` installer, x64 | You can choose the install folder. |
| Windows 10 and 11 | `-portable.exe`, x64 | No install needed. It takes longer to start, and keeps its data in the [same folder](/OrpheusApi-App/docs/getting-started/data/) as the installed app. |
| macOS, Apple Silicon and Intel | `.dmg` disk image | Drag Orpheus into Applications. |
| Linux | `.AppImage`, x86_64 | No install needed. |

## The first launch

Orpheus is in alpha and the builds are not signed yet, so your system will ask before opening it the first time.

- **Windows:** SmartScreen shows "Windows protected your PC". Choose **More info**, then **Run anyway**.
- **macOS:** Gatekeeper says the developer cannot be verified. Right-click the app, choose **Open**, then **Open** again.
- **Linux:** make the file executable, then run it:

  ```sh
  chmod +x OrpheusApi-*.AppImage
  ./OrpheusApi-*.AppImage
  ```

## Updating

There is no auto-update yet. Download the new version and install it over the old one. Your collections, environments and settings are kept.
