---
title: Import and export
description: Bring collections in from Postman, OpenAPI and cURL, and take them back out.
---

## Import a collection

Choose **Import Collection** from the collection menu at the top of the sidebar.

| Format | Versions | Input |
|---|---|---|
| Postman collection | v2, v2.1 and v3 | JSON or YAML file |
| OpenAPI | 3.x | JSON or YAML file |
| Swagger | 2.0 | JSON or YAML file |
| cURL | One or more commands | Pasted text |

- **Postman:** folders, requests, headers, query parameters, bodies and Basic, Bearer and API key auth are carried over. Collection variables and scripts are not.
- **OpenAPI and Swagger:** one request per operation. Each tag becomes a folder, and an example body is filled in when the spec has one.
- **cURL:** each command becomes a request.

## Import an environment

Postman environments are imported from the **Environments** menu in the toolbar, not the collection menu.

## Export

Choose **Export Collection** from the collection menu and pick a format:

- **Orpheus JSON** or **Orpheus YAML**: everything, including body and script versions.
- **Postman JSON** or **Postman YAML**: a Postman collection with the selected body of each request. Scripts and other body versions are left out.

## Copying a single request

To share one request, copy it as code. See [Code snippets](/OrpheusApi-App/docs/guides/snippets/).
