---
title: Invariant testing
description: Write rules that must always hold, and let Orpheus send random sequences of requests until one breaks.
---

Tests you write check the scenarios you thought of. Invariant testing looks for the ones you didn't. You write rules that must hold whatever happens, such as "money is never created or destroyed". Orpheus then sends random sequences of your collection's requests, with made-up values, and checks the rules after every step.

When a rule breaks, Orpheus cuts the sequence down to the shortest one that still breaks it, and replays it to check that it breaks every time. A typical result, against the Ledger sample:

> **Broken: money is never created or destroyed.** Expected 37590 to be 24440. Reproducible: broke 3 of 3 replays.
>
> 1. Reset
> 2. Open account: owner "Ada", deposit 244.40
> 3. Transfer: from acc_1, to acc_1, amount 131.50

Nobody writes a test for a transfer to the same account. The explorer tries it because it reuses values on purpose.

Suites are saved in the collection file, like [execution plans](/OrpheusApi-App/docs/guides/execution-plans/), and run from the [command line](/OrpheusApi-App/docs/guides/command-line/#explore-an-invariant-suite) too.

## Try it on the Ledger sample

The [`samples/ledger`](https://github.com/MobilotronicDevStudio/OrpheusApi-App/tree/main/samples/ledger) folder of the Orpheus repository holds a small bank API with bugs planted on purpose, and a collection with a ready-made suite. To follow along, clone or download the repository. Running the API needs [Node.js](https://nodejs.org/).

1. From the repository's folder, start the API: `node samples/ledger/ledgerApi.mjs`. It listens on `http://localhost:4020`.
2. Load `Ledger API.json` from the collection menu, import `Local environment.postman.json` as an environment, and pick it under **Uses environment**.
3. Open **Money** under **Invariant tests**, below the collection tree.
4. The tab says the environment doesn't allow exploration. Click **Manage environments**, turn on **Allow exploration**, and save.
5. Click **Explore**.

It finds the self-transfer bug in well under a second. The sample's [README](https://github.com/MobilotronicDevStudio/OrpheusApi-App/tree/main/samples/ledger) lists the other bugs, and how to turn each one on.

## Only against data you can lose

Exploring sends hundreds or thousands of requests, and many of them change data: it opens accounts, moves money and closes them. So it only runs against an environment with **Allow exploration** turned on, in **Manage environments**. The switch is off for every environment until you turn it on. Turn it on for a local or test server you can reset, never for production.

Every run also has a budget of requests it never goes over.

## The suite's tab

A suite opens in a tab. Its **Test** tab shows the suite as a tree, the way the sidebar shows a collection, with the part you pick on the right:

- **Requests:** the requests the test sends.
- **Rules:** what must always be true.
- **Settings:** how each run starts, and how long the test looks.

**Saved failures** and **Results** are tabs of their own.

## Requests

The test sends these one at a time, in a random order, many times in each run and over many runs. Add them with **+** next to **Requests**: they are usually the ones that change things, such as opening an account or making a transfer.

Pick a request to see:

- **How often** it is picked, as a weight, and what share of the steps that comes to.
- **Values:** where each `{{variable}}` it uses gets its value. A variable the environment, the collection or a request's script already fills keeps that value. One that nothing fills is marked; **Make up values** gives it one.
- **Sets:** the variables its script sets, which later requests can use.

### Made-up values

Each made-up value comes from a generator:

| Generator | Values |
|---|---|
| Whole number | Whole numbers between a minimum and a maximum. |
| Decimal | Numbers between a minimum and a maximum, with a number of decimal places. |
| Text | Text up to a length. |
| One of | One of the values you list. |
| True or false | `true` or `false`. |
| Set earlier in the run | A value a request's script set earlier in the run, such as the `accountId` of an account it opened. |

About a quarter of the time, a number or text generator picks an awkward value instead: 0, -1, the ends of the range and just past them, one decimal place too many, empty or very long text, accents and emoji. That is where bugs tend to hide.

The values just past the range check that the API rejects what it shouldn't take: a client can always send them, through a rounding slip such as `0.1 + 0.2` or on purpose, and the right answer is a 4xx. To test only what the inputs allow, turn on **Stay in range** in the settings. The awkward values then stay inside the range, such as its ends and the values just inside them.

**Set earlier in the run** picks one of the values set so far, and sometimes the same one for two variables, which is how the explorer finds a transfer from an account to itself. A request that needs one waits until a step has set it.

## Rules

Add a rule with **+** next to **Rules**. A rule has three parts, top to bottom:

1. **Its title:** what must always be true, such as "no balance is negative". A broken rule is reported by it.
2. **Reads after every step:** requests sent after each step so the rule sees what the server holds now, such as "List accounts". A step's own answer rarely shows the whole state.
3. **How it is checked:** code, written with the same `orpheus.expect` as [tests](/OrpheusApi-App/docs/guides/scripts/), run after every step. The rule breaks when an expectation fails, or when the code throws an error of its own.

```js
for (const account of orpheus.probes['List accounts'].data.items) {
  orpheus.expect(account.balance).not.toBeLessThan(0)
}
```

The code can read:

| Value | What it holds |
|---|---|
| `orpheus.step` | The request just sent: its `index`, its name as `action`, the `inputs` it got, and its `response`, with `status` and `data`. |
| `orpheus.probes[name]` | The answer to each request the rule reads, by the request's name, with `status` and `data`. |
| `orpheus.model` | An object of the rule's own that lasts for the whole run, for what it needs to remember. |

Each rule stands alone: it sees only the requests it reads, and its `orpheus.model` is its own. `orpheus.model` is how a rule keeps track of what should be true. The Money suite's first rule adds up every deposit as accounts open, then checks that the balances still add up to it:

```js
const cents = value => Math.round(value * 100)
if (orpheus.step.action === 'Open account' && orpheus.step.response.status === 201) {
  orpheus.model.deposited = (orpheus.model.deposited ?? 0) + cents(orpheus.step.response.data.balance)
}
const accounts = orpheus.probes['List accounts'].data.items
const total = accounts.reduce((sum, account) => sum + cents(account.balance), 0)
orpheus.expect(total).toBe(orpheus.model.deposited ?? 0)
```

A mistake in the code, such as reading a field of `undefined`, stops the run with the rule's name and the error, rather than counting as a broken rule. A rule with no code stops the suite from running until you write some.

**The server never fails** is built in, under the rules: it breaks when any answer is a 5xx, or a request gets no answer at all. Pick it to turn it off.

Rules never send requests themselves. To see more of the API's state, add a request the rule reads.

## Settings

| Setting | What it does |
|---|---|
| Start each run with | Requests sent in order before each run, so it begins from a known state, such as a reset or a login. |
| Preset | Quick sends up to 500 requests, CI up to 2,000 from the same seed each time, and Deep up to 20,000. Custom sets the budget yourself. |
| Steps per sequence | The most steps in one run before the next one starts. |
| Stay in range | Makes up only values the inputs allow. Off, some values sit just past the inputs' ends, to check that the API rejects them. |
| Seed | Leave it empty for a new random seed each run. The same seed against the same API sends the same requests, so a run can be repeated exactly. |
| Environment | In the toolbar. Empty means the collection's environment. |

The budget counts requests, not time. After a run, the settings show how long the next one should take at the speed the last one went: against a local API, Quick usually takes a few seconds.

## Results

While it runs, the **Results** tab shows the requests sent, the sequences, the rule checks, the requests a second and roughly how long is left. **Stop** ends it early.

When a rule breaks, the tab says, in a few sentences:

- **What was sent and what came back:** the request that broke the rule, with the values it got, and the status or the rule's own message. When a request a rule reads is what failed, it names that request.
- **What came before it.** Usually nothing but setup: the sequence is already as short as it gets.
- **Values worth a look:** the step's values that were awkward for their inputs, such as an amount with more decimal places than the input allows, a 0, or text longer than its maximum. They are the first place to look for the cause.
- **What the values say.** When a value outside its input's range broke it, the API should have rejected that value with a 4xx: the tab says so, and whether the API took it in instead. When every value was one the inputs allow, it says that too, since then requests a client may rightly send break the API.
- **How sure it is.** **Reproducible** means every confirming replay broke the rule again. **Flaky** means only some did, which often points at timing or at data left by earlier requests.
- **How much was cut:** how many actions the sequence that first broke it had, and how many are needed.

Below that is the shortest sequence, with the step that broke open. Open any step to see its request, its response and what the rules read after it. When a response is an HTML page, such as a server's error page, its title is shown above the body.

For example, against ParaBank:

> **Broken: No server errors.** Transfer (fromAccountId = "12345", toAccountId = "12345", amount = 0.025) answered 500. It was the first request after setup.
>
> Values worth a look: amount = 0.025 has more decimal places than the 2 the input allows.
>
> amount = 0.025 is outside what the input allows: Transfer should reject it with a 4xx instead of failing.

ParaBank doesn't always fail on the spot. Transfer 0.025 between two different accounts and it answers 200, and from then on both accounts and the customer's list of accounts answer 500 until the database is reset. One request a client can send by mistake leaves a customer unable to see their accounts. Exploration finds that because it checks every response after every step, not only the one it sent.

**Replay** sends the same sequence again, for checking a fix.

## Saved failures

**Save failure** keeps the sequence in the suite. Every later run replays saved failures first, before exploring, and says whether each one is still broken or fixed. They become regression tests for the bugs exploration found.

The **Saved failures** tab replays them on their own, one or all, and removes the ones you no longer need.

## With the assistant

The [assistant](/OrpheusApi-App/docs/assistant/overview/) can build a suite for you. Ask it, for example, "build an invariant test for the Ledger collection that checks money is never created or destroyed". It reads which requests set which variables, picks the requests to send and how each run starts, makes up values for each variable nothing fills, and writes each rule with what it reads and its code. When a request doesn't say what range a value allows, it should ask you, since the [values just past the range](#made-up-values) are judged by it.

The suite arrives as a change in the chat, and is added once you apply it. Until you review it, the tab says so and **Mark as reviewed** ends it. Meanwhile:

- Its rules run without your secrets, as scripts the assistant wrote do. See [the assistant's safety](/OrpheusApi-App/docs/assistant/safety/#scripts-it-wrote-cant-see-secrets).
- Every request is checked for where it goes, since an input can fill `{{baseUrl}}` too.

The assistant can't turn on **Allow exploration** for an environment; only you can.

It can also run a saved suite, with a budget of up to 2,000 requests, against the suite's own environment. It always asks first, even if you allowed every run, and the environment must allow exploration. When it runs one, it sees the suite's name, its rule names and its input names, never their values.
