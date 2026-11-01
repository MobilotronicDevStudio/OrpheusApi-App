---
title: Collections and folders
description: Organise requests, and set auth and variables once for a whole group.
---

A collection is one JSON file holding requests and folders. Folders can hold more folders.

## Switching collections

The menu at the top of the sidebar names the collection the sidebar shows. Open it to switch to another collection, or to add, load, import, edit, save, export, run or delete one.

Under it, **Uses environment** picks which of the shared environments the collection's requests run against. See [Variables and environments](/OrpheusApi-App/docs/guides/variables/#environments).

When you switch to a tab from another collection, the sidebar follows it, and the tree highlights the open request. Each collection has a colour, shown on its tabs and in the toolbar, so tabs from different collections are easy to tell apart.

## Working with the tree

- **Add** a request or folder with the buttons next to the filter box, or the icons on a folder row.
- **Move** a request by dragging it to another folder.
- **Filter** with the box above the tree. Dragging is turned off while a filter is active.
- **Run** a folder with the play icon on its row. See [Collection runner](/OrpheusApi-App/docs/guides/runner/).

## Collection settings

Choose **Edit Collection** from the collection menu to change its name, description, colour, variables and auth.

- **Variables** set here are available to every request in the collection. See [Variables and environments](/OrpheusApi-App/docs/guides/variables/).
- **Auth** set here is used by every request whose auth is **Inherit**.

## Folder settings

A folder can have its own auth. Requests inside it that inherit use the folder's auth, and a folder that inherits uses its parent's. See [Authentication](/OrpheusApi-App/docs/guides/authentication/#inheritance).

## Saving

Changes to a request are saved with <kbd>Ctrl</kbd>+<kbd>S</kbd>. A tab with unsaved changes is marked, and Orpheus asks before closing it or quitting.
