---
title: Variables and environments
description: Five scopes, one placeholder syntax, and a clear order of precedence.
---

Write `{{name}}` anywhere in a request: the URL, query parameters, headers, auth fields or the body. Orpheus replaces it with a value when the request is sent.

## Scopes

A variable can be defined in five places. When the same name exists in more than one, the first one in this list wins:

1. **Request:** the request's **Variables** tab. Values set by a script during a run, and a data row's values, also land here.
2. **Plan:** the variables of the [execution plan](/OrpheusApi-App/docs/guides/execution-plans/) running the request. Outside a plan run there are none.
3. **Environment:** the environment of the request's collection.
4. **Collection:** the collection's settings.
5. **Globals:** shared by everything. Open them with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>.

So a request can override an environment value for itself, and an environment can override a collection default.

## Seeing what will be sent

Placeholders in the URL bar are highlighted. Hover over one to see the value it resolves to right now, with the current environment. Typing `{{` suggests the variables that are in scope.

## Environments

Environments are a shared list. Open **Environments** in the toolbar and choose **Manage Environments** (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>E</kbd>) to add, rename or delete them and edit their variables. The same menu loads environments from a file or imports them from Postman.

Each collection picks the environment it uses, under **Uses environment** below the collection menu. The list shows which other open collections use each environment. Requests from two collections can be open side by side, each running against its collection's environment. The toolbar shows the environment of the open request next to its collection. Collection runs and the assistant use the same environment unless told otherwise.

Editing an environment changes it for every collection that uses it.

## Secret variables

Mark a variable as **secret** when it holds a password, token or key. Secret values are:

- masked in the editors;
- always redacted before the [assistant](/OrpheusApi-App/docs/assistant/safety/) sees anything.

Scripts can create secret variables too:

```js
orpheus.environment.set('token', orpheus.response.data.token, { secret: true })
```

## From scripts

Each scope has the same small API: `get`, `set`, `unset` and `has`. `orpheus.resolve(name)` reads whichever scope wins. See the [Script API](/OrpheusApi-App/docs/reference/script-api/).
