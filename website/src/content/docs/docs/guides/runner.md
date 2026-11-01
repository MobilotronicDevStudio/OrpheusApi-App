---
title: Collection runner
description: Run a collection or a folder, once or many times, and export the results.
---

Open the runner with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>, **Run Collection** in the collection menu, or the play icon on a folder.

The runner's options reset each time it opens. To keep a selection of requests, an order and settings for next time, save them as an [execution plan](/OrpheusApi-App/docs/guides/execution-plans/).

## Options

| Option | What it does |
|---|---|
| Serial | Runs requests one after another, in tree order. Variables a script sets are available to the requests after it. |
| Parallel | Runs requests at the same time. Faster, but requests cannot depend on each other. |
| Environment | Which environment to resolve variables against. |
| Iterations | How many times to run the whole set. |
| Data file | A CSV or JSON file with one row per iteration. |
| Stop on first failure | Skips the remaining requests once one fails. |

## Data-driven runs

Choose a CSV file with a header row, or a JSON array of objects. Orpheus runs once per row, and each column is available as a variable for that iteration:

```csv
customerId,currency
cus_2817,EUR
cus_1930,USD
```

```
{{baseUrl}}/v1/customers/{{customerId}}?currency={{currency}}
```

Row values take precedence over every other scope.

## Results

Each request shows its status, HTTP code and duration. Expand a row for its details. A request fails when it cannot be sent or when one of its tests fails.

- **Export JSON** saves the full results for other tools.
- **Export HTML** saves a report you can open in any browser or attach to a ticket.
- **Export JUnit** saves JUnit XML, the format CI systems read test results from. Each folder is a test suite and each request a test case.
- **Analyse this run** hands the results to the [assistant](/OrpheusApi-App/docs/assistant/overview/), which groups the failures and suggests causes.
