# Storefront sample

A small collection with a local mock API, used for the website screenshots and for trying changes by hand.

1. Start the mock API: `node samples/storefront/mockApi.mjs`. It listens on `http://localhost:4010`, or on the port in `PORT` (`PORT=0` picks a free one).
2. In Orpheus, open the collection menu at the top of the sidebar, choose **Load Collection** and pick `Storefront API.json`.
3. From the **Environments** menu in the toolbar, import `Local environment.postman.json` as a Postman environment, then pick it under **Uses environment** in the sidebar.

The two Checkout requests return 404 on purpose, so a collection run has failures to look at.

## Worker checks

The **Worker checks** folder exercises the script sandbox. Run the folder from the collection runner:

| Request | Expected |
|---|---|
| Slow script (5 s) | Passes after 5 seconds. The app stays responsive meanwhile. |
| Saves a variable | Passes, and the Local environment gets `lastHealthCheck`. |
| Endless loop | Fails after 10 seconds: "The script was stopped after 10 seconds." |
| Out of memory | Fails in about a second: "The script ran out of memory." |
