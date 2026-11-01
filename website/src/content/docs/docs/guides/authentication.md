---
title: Authentication
description: Basic, Bearer, API key, NTLM and OAuth 2.0, set once and inherited.
---

Pick an auth type on a request's **Auth** tab, or in a folder's or collection's settings. Every field accepts a literal value or a variable.

| Type | What is sent |
|---|---|
| Inherit | Whatever the parent folder or collection uses. The default for new requests. |
| None | Nothing. |
| Basic | `Authorization: Basic` with a username and password. |
| Bearer | `Authorization: Bearer` with a token. |
| API key | A key in a header you name. |
| NTLM | Windows authentication with a username, password and domain. |
| OAuth 2.0 | A token Orpheus obtains and renews for you. |

## Inheritance

A request set to **Inherit** walks up its folders until one sets an auth type, and falls back to the collection's. Set auth once on the collection and every new request picks it up.

## NTLM

NTLM works without a proxy or helper. The request is sent by the app itself, so intranet APIs behind Windows authentication just work. Your password goes only into the NTLM handshake with the server you addressed, never into a header. A redirect to another host comes back as the response instead of being followed.

## Redirects

Credentials stay with the host you addressed. When a response redirects to another origin, Orpheus drops `Authorization`, `Proxy-Authorization`, `Cookie`, `X-API-Key`, any header with a sensitive name and your API key header before following it.

## OAuth 2.0

Orpheus supports four grants:

- **Authorization code**, optionally with PKCE. Orpheus opens the sign-in page and catches the redirect.
- **Client credentials**, for machine-to-machine access.
- **Password**, the legacy username and password grant.
- **Implicit**, for older providers that still use it.

The client ID and secret can be sent in a Basic `Authorization` header or as form fields. Tokens are cached for the session and refreshed when they expire, when the server issued a refresh token.
