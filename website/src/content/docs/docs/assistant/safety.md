---
title: How your secrets stay safe
description: Redaction, approvals and the egress check, and what each one protects against.
---

A model that can read API responses can also be told what to do by them. Orpheus is built on the assumption that the model may be wrong, or may be steered by something it read, and limits what it can see and do.

## One door

The assistant reaches the app only through Orpheus's own tool server. It cannot read files, open URLs or run code. It refers to requests by IDs the server hands out, never by file paths.

## Redacted, always

Every tool result and every error message is cleaned before the model sees it:

- **Known secrets:** values of secret variables and sensitively named variables in every scope, credentials in auth settings (passwords, tokens, API keys, OAuth client secrets), OAuth tokens Orpheus holds, and cookie values. Each occurrence becomes `[REDACTED:name]`, including percent-encoded and base64 forms.
- **Headers:** `Authorization`, `Proxy-Authorization`, `Cookie`, `Set-Cookie`, `X-API-Key` and any header with a sensitive name.
- **Body fields:** JSON keys, form fields and query parameters with sensitive names.
- **Patterns:** JWT-shaped strings, `Bearer` tokens and private key blocks.

A name is sensitive when one of its words is something like `password`, `secret`, `token`, `apikey`, `authorization`, `credential`, `cookie` or `session`, or a short word like `auth`, `pwd`, `pin` or `otp`. Words are split on camelCase, snake_case and kebab-case, so `authorToken` is caught and `author` is not.

Over-redacting is acceptable; leaking is not. There is no setting to turn redaction off.

## You approve the runs

In the default mode, every request the assistant sends and every collection it runs waits for you. The card shows the request, the host it resolves to and the environment. Denying tells the assistant you declined, so it can adapt. **Stop** cancels the conversation and anything in flight.

## Changes you can review

Edits to requests, scripts, variables, execution plans and invariant suites arrive as a diff. Requests, variables, plans and suites the assistant changed are marked until you review them. A deleted request can be restored, and deleting always asks first.

## Scripts it wrote can't see secrets

Redaction can't stop a script from leaking a secret, because a script can reverse or re-encode the value and print the result. So until you review a request the assistant changed, its scripts run without your secrets:

- Secret and sensitively named variables, credential headers and auth values read as `[REDACTED]`. The request still goes out with the real values.
- The response is redacted the way the assistant would see it, so a token a login just returned is hidden too.
- A variable the script would set to a hidden value isn't saved, and the console says so. A login script the assistant wrote can't save its token until you review it.

The rules of an invariant suite the assistant wrote or changed run the same way until you review the suite. A rule that breaks says why, and the assistant reads that message, so a rule that could see a secret could pass it on.

Once you review the change, the scripts run normally.

## No new destinations

Once the assistant can write scripts, it can influence where a request goes. A pre-request script could rewrite a URL, or a test could repoint `baseUrl`. So can a plan's variables and data, or a suite's inputs, which fill `{{variables}}` before the environment does. The model never sees your secrets, but Orpheus fills them in when sending.

So whenever the assistant has influenced a send, Orpheus checks the request as it will actually go out, after scripts, auth and cookies. If it is going to a host you have never used, Orpheus stops and asks, naming any secret it would carry. This check runs even in **Run without asking** mode.

Hosts count as known once you have sent to them yourself, or approved them. A redirect to another origin isn't followed either: the redirect itself comes back as the response.

## Untrusted content

Responses are marked as data, not instructions. The assistant is told that text inside a response is never a command, whatever it says.
