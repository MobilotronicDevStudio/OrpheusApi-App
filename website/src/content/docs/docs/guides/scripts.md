---
title: Scripts and tests
description: Change a request before it is sent, and check the response after.
---

Every request can have two scripts, on its **Scripts** tab:

- a **pre-request script** runs before the request is sent and can change it;
- a **post-request script** runs after the response arrives and checks it.

Scripts are plain JavaScript. The editor completes and checks the `orpheus` API as you type.

## A pre-request script

```js
orpheus.request.headers['X-Request-Id'] = String(Date.now())
orpheus.variables.set('startedAt', Date.now())
```

A variable set here is used by this request's own `{{placeholders}}`.

## A post-request script

```js
orpheus.test('returns 200', () => {
  orpheus.expect(orpheus.response.status).toBe(200)
})

orpheus.test('has an id', () => {
  orpheus.expect(orpheus.response.data).toHaveProperty('id')
})

// Hand a value to the next request in a collection run
orpheus.variables.set('orderId', orpheus.response.data.id)
```

Each `orpheus.test` is reported on its own, on the response's **Tests** tab. A failed expectation fails that test only, and the rest still run. A failing test fails the request in a collection run.

## Contract tests

Check a response against a JSON Schema with `toMatchSchema`:

```js
const schema = {
  type: 'object',
  required: ['items', 'total'],
  properties: {
    total: { type: 'integer' },
    items: { type: 'array', items: { type: 'object', required: ['id', 'status'] } },
  },
}

orpheus.test('matches the contract', () => {
  orpheus.expect(orpheus.response.data).toMatchSchema(schema)
})
```

The **Add a contract test** button above a response asks the [assistant](/OrpheusApi-App/docs/assistant/overview/) to infer the schema from that response and write this test for you.

## Script versions

Like [body versions](/OrpheusApi-App/docs/guides/body-versions/), a request can keep several named sets of scripts and switch between them on the **Scripts** tab. Each version has its own pre-request and post-request script.

## The sandbox

Scripts run in an isolated QuickJS engine, on a separate thread, so a slow script never freezes the app:

- no network, no file system, no timers, no `require` and no DOM;
- strict mode;
- up to 256 MB of memory;
- stopped after 10 seconds.

Up to four scripts run at the same time. In a parallel collection run, the others wait for a free slot.

A script can only reach what the `orpheus` object gives it. `orpheus.log(...)` output, and any script error, is shown in the console below the request. The console opens by itself when a script fails.

See the [Script API](/OrpheusApi-App/docs/reference/script-api/) for everything available.
