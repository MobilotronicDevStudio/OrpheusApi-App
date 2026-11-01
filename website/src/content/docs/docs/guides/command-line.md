---
title: Run from the command line
description: Run collections without the app, in CI or from a script, with the orpheus executable.
---

`orpheus` runs a collection the way the [collection runner](/OrpheusApi-App/docs/guides/runner/) does, without the app. It is a single executable with nothing to install, so it suits CI and scripts.

```sh
orpheus run "Storefront API.json" -e Staging.json --env-var token=$API_TOKEN
```

## Get it

Each [release](https://github.com/MobilotronicDevStudio/OrpheusApi-App/releases) has an executable for each system:

| System | File |
|---|---|
| Windows, x64 | `orpheus-cli-<version>-win-x64.exe` |
| macOS, Apple Silicon | `orpheus-cli-<version>-mac-arm64` |
| Linux, x64 | `orpheus-cli-<version>-linux-x64` |

Rename it to `orpheus` if you like, and put it somewhere on your `PATH`. On macOS and Linux, make it executable first:

```sh
chmod +x orpheus
```

The executables are not signed yet. On macOS, a file downloaded in a browser is blocked the first time; clear that with `xattr -d com.apple.quarantine orpheus`. Files downloaded with `curl`, as in CI, are not affected. The Linux executable needs a glibc-based distribution, such as Ubuntu or Debian, not Alpine.

## Run a collection

```sh
orpheus run <collection> [options]
```

The collection is an Orpheus collection file, JSON or YAML, as saved or [exported](/OrpheusApi-App/docs/guides/import-export/) by the app. To run a Postman collection, import it into Orpheus and export it again.

| Option | What it does |
|---|---|
| `-e, --environment <file>` | An Orpheus or Postman environment. |
| `--env-var <name=value>` | Sets a variable, overriding the environment. Repeat it for more. |
| `-g, --globals <file>` | Global variables. |
| `--folder <path>` | Runs one folder, such as `Orders` or `Orders/Admin`. |
| `-p, --plan <name|id>` | Runs one of the collection's [execution plans](#run-an-execution-plan). |
| `--plan-var <name=value>` | Sets a plan variable, overriding the plan's. Repeat it for more. Needs `--plan`. |
| `--strict` | With `--plan`, fails the run when a step's request or folder is gone. |
| `-n, --iterations <n>` | Runs the selection n times. |
| `-d, --data <file>` | A CSV or JSON [data file](/OrpheusApi-App/docs/guides/runner/#data-driven-runs), one iteration per row. |
| `--parallel` | Sends requests at the same time. `--concurrency <n>` sets how many, 5 by default. `--serial`, the default, sends them one after another. |
| `--delay <ms>` | Waits this long between requests. In a parallel run, it is the least time between two requests starting. |
| `--bail` | Stops at the first failure. `--no-bail` keeps going, the default. |
| `-k, --insecure` | Doesn't verify TLS certificates. |
| `--max-response-size <MB>` | Accepts responses up to this size for every request. Without it, each request's own limit applies, 20 MB by default. |
| `-r, --reporters <list>` | `cli`, `json`, `html` and `junit`, separated by commas. `cli` by default. |
| `--reporter-<name>-export <file>` | Where to write a report. `orpheus-results.json`, `.html` or `.xml` by default. |
| `--export-environment <file>` | Saves the environment after the run, with what the scripts changed. |
| `--export-globals <file>` | Saves the globals after the run. |
| `--no-color` | Plain output. Colour is also off when the output isn't a terminal, or `NO_COLOR` is set. |

`orpheus help` and `orpheus run --help` list the options, and `orpheus version` prints the version.

## Run an execution plan

An [execution plan](/OrpheusApi-App/docs/guides/execution-plans/) saved in the collection runs with `--plan` and its name or id:

```sh
orpheus run "Storefront API.json" --plan "Smoke test" -e Staging.json
```

The plan's steps, settings, variables and data rows apply. Options given on the command line override them: `--parallel` or `--serial`, `--concurrency`, `-n`, `--delay`, `--bail` or `--no-bail`, and `-d`, which replaces the plan's data rows. `--plan-var` overrides a plan variable. A plan already says what to run, so `--plan` and `--folder` don't go together.

A plan's environment lives in the app, not in the collection file, so pass it with `-e`. Without one, `orpheus` notes that the plan has one and runs without it.

Steps whose request or folder was deleted are skipped with a warning. Add `--strict` to make that fail the run, with exit code 1, so a plan that drifted from its collection doesn't pass unnoticed.

`orpheus plans` lists a collection's plans, with their ids, step counts, mode and iterations. `--json` prints the list as JSON.

```sh
orpheus plans "Storefront API.json"
```

## Explore an invariant suite

An [invariant suite](/OrpheusApi-App/docs/guides/invariant-testing/) saved in the collection runs with `orpheus explore`:

```sh
orpheus explore "Ledger API.json" --suite Money -e Local.json --preset ci --junit explore.xml
```

It replays the suite's saved failures, then explores, and prints the rule that broke with the shortest sequence that breaks it.

| Option | What it does |
|---|---|
| `-s, --suite <name|id>` | The suite to run. Not needed when the collection has one. |
| `-e, --environment <file>`, `--env-var`, `-g, --globals` | As for `orpheus run`. |
| `--preset <name>` | `quick`, `ci` or `deep`, in place of the suite's own. |
| `--seed <n>` | Starts from this seed, to send the same requests as an earlier run. |
| `--budget <calls>` | The most requests to send while exploring. |
| `--steps <n>` | The most actions in one sequence. |
| `--in-range` | Makes up only values the inputs allow, as the **Stay in range** setting does. |
| `--replay-only` | Only replays the saved failures. |
| `--save-failures` | Saves a new failure in the collection file, so later runs replay it. |
| `--allow-exploration` | Explores with an environment that doesn't allow it. |
| `--junit <file>` | Also writes the result as JUnit XML: one test case per saved failure, and one for exploring, with the sequence in its failure. |
| `--json` | Prints the result as JSON. |

Exploring sends many requests that change data, so it refuses an environment that doesn't allow it. An Orpheus environment saved by the app carries the app's **Allow exploration** switch. A Postman environment can't, so pass `--allow-exploration` with it, and only for data you can lose.

The exit code is 0 when no rule broke, 1 when one did or a saved failure is still broken, and 2 when the suite can't run: a wrong option, an environment that doesn't allow exploring, or a rules script that fails.

`orpheus suites` lists a collection's suites, with their ids and rules. `--json` prints the list as JSON.

## Secrets

Keep tokens and passwords out of the files you commit, and pass them with `--env-var` from your CI's secret store. Variables passed this way are left out of `--export-environment`, so they are not written back to disk.

## Results

While it runs, `orpheus` prints each request as it finishes, with its tests, then a summary that repeats the failures.

The exit code tells CI how the run went:

| Code | Meaning |
|---|---|
| 0 | Every request passed. |
| 1 | At least one request failed: a test failed, the status was an error, or a script stopped it. |
| 2 | The command or one of its files was wrong, or `--plan` named no plan, or more than one. Nothing was run. |

For CI, add the `junit` reporter. JUnit XML is the format CI systems read test results from: each folder is a test suite and each request a test case. A plan run names its suites after the plan, and each case after its step.

## In GitHub Actions

```yaml
- name: Download orpheus
  run: |
    curl -fsSL -o orpheus https://github.com/MobilotronicDevStudio/OrpheusApi-App/releases/download/v<version>/orpheus-cli-<version>-linux-x64
    chmod +x orpheus

- name: Run the API tests
  run: ./orpheus run api/Storefront.json -e api/Staging.json --env-var token=${{ secrets.API_TOKEN }} -r cli,junit --reporter-junit-export results.xml

- name: Keep the results
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: api-test-results
    path: results.xml
```

Pin the version in the URL, so a pipeline keeps the same `orpheus` until you change it.

## What it doesn't do yet

- **NTLM** authentication is only available in the app. A request that uses it fails with a message saying so, rather than going out without its credentials.
- **OAuth 2.0 grants that open a sign-in window**, authorization code and implicit, can't run without one. Client credentials and password grants work. For the others, get a token another way and pass it with `--env-var`.
- **Response bodies** are not printed. Use the `json` or `html` reporter, or `orpheus.log()` in a script.
