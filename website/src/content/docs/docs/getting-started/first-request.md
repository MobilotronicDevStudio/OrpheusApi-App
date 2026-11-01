---
title: Your first request
description: Create a collection, an environment and a request, then send it.
---

This takes about two minutes and covers the parts you will use every day.

## 1. Create a collection

A collection holds your requests, optionally grouped in folders. Open the collection menu at the top of the sidebar, choose **Add Collection** and give it a name. To bring in something you already have, choose **Import Collection** instead: see [Import and export](/OrpheusApi-App/docs/guides/import-export/).

## 2. Create an environment

Environments hold the values that change between places you call, such as a local server and staging. Open **Environments** in the toolbar and choose **Manage Environments** (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>E</kbd>), add one called `Local`, and give it a variable:

| Name | Value |
|---|---|
| `baseUrl` | `http://localhost:3000` |

Then pick it from the **Uses environment** list under the collection menu. Environments are shared: each collection picks the one it runs against, and the toolbar shows it next to the open request.

## 3. Add a request

Click **+** next to the filter box above the tree, choose a method and a name, then type the URL:

```
{{baseUrl}}/health
```

The `{{baseUrl}}` part is highlighted. Hover over it to see the value that will be sent. Placeholders work anywhere: the URL, query parameters, headers, auth fields and the body.

## 4. Send it

Press **Send** or <kbd>Ctrl</kbd>+<kbd>Enter</kbd> (<kbd>⌘</kbd>+<kbd>Enter</kbd> on macOS). The response appears on the right with its status, time and size.

- **Body** shows the response, formatted when it is JSON.
- **Headers** and **Cookies** show what came back.
- **Tests** lists the result of each test your scripts ran.

The console below shows what the scripts logged and any errors. Its **Timeline** tab shows how long each phase took: DNS lookup, TCP connect, TLS, time to first byte and transfer.

The toolbar always shows where you are: the collection, folder and request of the open tab.

Save the request with <kbd>Ctrl</kbd>+<kbd>S</kbd>.

## Next

- Add checks to the response with [scripts and tests](/OrpheusApi-App/docs/guides/scripts/).
- Keep several bodies on one request with [body versions](/OrpheusApi-App/docs/guides/body-versions/).
- Run everything at once with the [collection runner](/OrpheusApi-App/docs/guides/runner/).
- Ask the [assistant](/OrpheusApi-App/docs/assistant/overview/) about a response.
