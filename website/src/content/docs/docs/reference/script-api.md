---
title: Script API
description: Everything a pre-request or post-request script can use.
---

Scripts are plain JavaScript in strict mode. There is no network, no file system, no timers, no `require` and no DOM. A script can use up to 256 MB of memory and is stopped after 10 seconds.

## `orpheus.request`

The request as it will be sent: `{ url, method, headers, body }`. A pre-request script may change any of them.

```js
orpheus.request.headers['X-Request-Id'] = String(Date.now())
orpheus.request.url += '&debug=1'
```

## `orpheus.response`

Post-request scripts only: `{ status, statusText, data, headers, durationMs }`.

- `data` is the parsed JSON when the body is JSON, otherwise the text.
- Header names are lowercase.

## `orpheus.test(name, fn)`

One named check. A failed expectation fails that test only, and the others still run.

## `orpheus.expect(value)`

| Matcher | Passes when |
|---|---|
| `toBe(expected)` | `value === expected` |
| `toEqual(expected)` | the two are deeply equal |
| `toBeTruthy()` | `value` is truthy |
| `toBeFalsy()` | `value` is falsy |
| `toBeNullish()` | `value` is `null` or `undefined` |
| `toContain(item)` | a string or array contains `item` |
| `toBeGreaterThan(n)` | `value > n` |
| `toBeLessThan(n)` | `value < n` |
| `toHaveProperty(name)` | an object has the property |
| `toMatch(pattern)` | a string matches a regex or contains a string |
| `toMatchSchema(schema)` | `value` is valid against a JSON Schema |

Put `.not` in front of any matcher to negate it:

```js
orpheus.expect(orpheus.response.data.items).not.toContain(null)
```

`toMatchSchema` supports `type`, `properties`, `required`, `additionalProperties`, `items`, `enum`, `const`, `anyOf`, `minItems`, `maxItems`, `minLength`, `maxLength`, `minimum`, `maximum` and `pattern`.

## Variables

Five objects, one per scope, with the same methods:

| Object | Scope |
|---|---|
| `orpheus.variables` | This request, and later requests in the same collection run. |
| `orpheus.planVariables` | The [execution plan](/OrpheusApi-App/docs/guides/execution-plans/) running the request. A change lasts for the rest of the run and is never saved. Outside a plan run, a write is ignored and the console says why. |
| `orpheus.environment` | The selected environment. |
| `orpheus.collectionVariables` | The request's collection. |
| `orpheus.globals` | Everything. |

| Method | Does |
|---|---|
| `get(name)` | Reads a value. |
| `set(name, value, { secret })` | Writes a value. Pass `{ secret: true }` for tokens and other credentials. |
| `unset(name)` | Removes it. |
| `has(name)` | Whether it exists. |

`orpheus.resolve(name)` reads whichever scope wins. See [Variables and environments](/OrpheusApi-App/docs/guides/variables/#scopes) for the order.

A variable set in a pre-request script is used by that request's own `{{placeholders}}`.

## In invariant rules

The code of an [invariant suite's](/OrpheusApi-App/docs/guides/invariant-testing/#rules) rule runs after every step, and can read these as well. The rule breaks when an expectation fails, or the code throws an error of its own.

| Member | What it is |
|---|---|
| `orpheus.step` | The request just sent: `index`, `action` (the request's name), `inputs`, and `response` with `status` and `data`. |
| `orpheus.probes[name]` | The answer to each request the rule reads, after the step, with `status` and `data`. |
| `orpheus.model` | An object of the rule's own to write to. It lasts for the whole run. |

Outside a rule's code, these are not defined.

## `orpheus.log(...values)`

Shows values next to the script results, for debugging.
