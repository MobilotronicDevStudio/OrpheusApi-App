---
title: Body versions
description: Keep every variant of a request body on the same request.
---

Testing one endpoint usually means sending several bodies: a valid one, one with a field missing, one that is far too large. Instead of keeping near-identical requests or commenting JSON in and out, give one request several named bodies.

## Using versions

On the **Body** tab:

- the list on the left picks which version is sent;
- the field next to it renames the current version;
- **Add Version** creates a new, empty one;
- **Remove Version** deletes the current one, after asking.

Each version has its own body type and content. The selected version is saved with the request, so the collection runner sends it too.

## Body types

| Type | Use it for |
|---|---|
| JSON | JSON payloads, with highlighting and formatting. |
| XML | XML payloads. |
| Raw | Any other text. |
| Form URL-encoded | `application/x-www-form-urlencoded` key and value pairs. |
| Form data | `multipart/form-data` fields. |
| Binary | A file sent as the whole body. |
| None | No body. |

Placeholders work in text bodies and in form fields.

## Script versions

Scripts have versions too, picked on the **Scripts** tab. A request can keep a quick **Smoke** set of tests next to a stricter **Contract** set and switch between them. See [Scripts and tests](/OrpheusApi-App/docs/guides/scripts/#script-versions).
