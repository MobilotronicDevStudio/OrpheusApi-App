---
title: Execution plans
description: Save named test scenarios for a collection, each with its own steps, order, settings, variables and data.
---

An execution plan is a saved way to run a collection. Where the [collection runner](/OrpheusApi-App/docs/guides/runner/) runs everything in tree order, a plan runs the requests and folders you pick, in the order you set, with settings that stay with it. A collection can have as many plans as you need: a quick smoke test, a full regression run, one scenario per customer type.

Plans are saved in the collection file, so they travel with it and run from the [command line](/OrpheusApi-App/docs/guides/command-line/#run-an-execution-plan) too.

## Create a plan

The **Execution plans** section sits below the collection tree. Click **+** to add a plan and give it a name. Names are unique within a collection, ignoring case.

Click a plan to open it in a tab. Its menu renames, duplicates or deletes it, and the play icon runs it.

## Steps

A step is a request or a folder. **Add steps** shows the collection's tree: check what you want, and each checked item becomes a step at the end of the plan, in collection order. A folder step runs every request in the folder and its subfolders, in tree order.

| On a step | What it does |
|---|---|
| Checkbox | Turns the step off without removing it. |
| × count | Runs the step several times in a row. A folder repeats as a whole. |
| Arrows, or drag | Changes the order. |
| Bin | Removes the step. |

The same request can appear in several steps, for example a login at the start and again after a logout.

A step that uses a `{{variable}}` only a later step sets, or one that no step sets and no scope defines, shows a warning, so a plan in the wrong order is caught before it runs. Values that a script sets under a name it works out at run time are not checked.

If you delete a request or folder a step points at, the step is marked as missing. A run skips it and reports why, and it never counts as a failure that stops the run.

## Settings

| Setting | What it does |
|---|---|
| Mode | Serial runs steps one after another, so variables a script sets reach the requests after it. Parallel sends several at once. |
| Concurrency | In a parallel run, how many requests are in flight at once. |
| Iterations | How many times to run the whole plan. Ignored when the plan has data rows. |
| Delay | In a serial run, a wait between one request and the next. In a parallel run, the least time between two requests starting. |
| Stop on first failure | Skips the remaining requests once one fails. |
| Environment | In the toolbar. The environment the plan runs against; empty means the collection's. |

## Variables

Plan variables apply to every request the plan runs. They sit between request variables and the environment:

1. Request variables, data row values, and values scripts set during the run
2. **Plan variables**
3. Environment
4. Collection
5. Globals

So a plan can point the same requests at another tenant or page size without touching the environment. A script reads and changes them with `orpheus.planVariables`. A change lasts for the rest of the run and is never saved.

Plan variables are saved in the collection file, as written. Keep tokens and passwords in an [environment](/OrpheusApi-App/docs/guides/variables/).

## Data

**Import CSV or JSON** copies a data file's rows into the plan. Each row runs the plan once, its columns available as variables, as in a [data-driven run](/OrpheusApi-App/docs/guides/runner/#data-driven-runs). The rows are saved with the plan, so the file isn't needed afterwards. Very large data makes the collection file large too; the tab warns you above about 5,000 rows or 1 MB.

## Run it

**Run** in the tab, or <kbd>Ctrl</kbd>+<kbd>Enter</kbd>, runs the plan as it is in the tab, saved or not, the way **Send** sends a request's unsaved edits. **Save**, or <kbd>Ctrl</kbd>+<kbd>S</kbd>, saves it.

The **Results** tab shows each request as it finishes, with the step it came from. Export JSON, HTML or JUnit reports from there, or hand the run to the assistant with **Analyse this run**. Report files are named after the collection and the plan.

## With the assistant

The [assistant](/OrpheusApi-App/docs/assistant/overview/) can list and run plans. It runs a plan as saved, and asks first unless you allowed every run.

It can also create a plan, or change one: its steps, settings, environment, variables and data rows. Each change arrives in the chat as a diff to apply. It sees a plan's variables and data columns by name, never their values.

A plan the assistant created or changed is marked until you review it, with **Mark as reviewed** in its tab. Plan variables and data come before the environment, so until then every request is checked for where it goes.
