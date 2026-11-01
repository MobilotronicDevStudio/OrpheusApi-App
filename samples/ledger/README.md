# Ledger sample

A small bank: accounts and transfers between them, with bugs planted on purpose. It is the target for invariant testing, where Orpheus sends random sequences of requests and checks rules such as "money is never created or destroyed".

1. Start the API: `node samples/ledger/ledgerApi.mjs`. It listens on `http://localhost:4020`, or on the port in `PORT` (`PORT=0` picks a free one).
2. In Orpheus, choose **Load Collection** in the collection menu and pick `Ledger API.json`.
3. From the **Environments** menu, import `Local environment.postman.json` as a Postman environment, then pick it under **Uses environment**.

The **Happy path** execution plan opens two accounts and moves 40 from the first to the second. It passes even with every bug on, because the bugs need inputs nobody thinks to try.

## Routes

| Route | Does |
|---|---|
| `POST /accounts {owner, deposit}` | Opens an account. |
| `GET /accounts`, `GET /accounts/:id` | Lists accounts, or reads one. |
| `POST /accounts/:id/close` | Closes an account whose balance is 0. |
| `POST /transfers {from, to, amount}` | Moves money between two open accounts. |
| `GET /transfers` | Lists transfers. |
| `POST /reset` | Removes every account and transfer. |
| `GET /health` | Lists the bugs that are on. |

Amounts are positive, with at most two decimals. Everything is kept in memory.

## Planted bugs

All are on by default. `BUGS=none` turns them off, and `BUGS=self-transfer,rounding` turns on just those.

| Bug | What goes wrong | A rule that catches it |
|---|---|---|
| `self-transfer` | A transfer to the same account credits it without debiting. | The total of all balances only changes on deposits. |
| `negative-amount` | A negative amount is accepted and pulls money from the receiver. | No balance is negative. |
| `rounding` | Only the whole part of a decimal amount is debited. | The total of all balances only changes on deposits. |
| `closed-account` | A closed account can still receive money. | A closed account's balance stays 0. |
| `overdraft-race` | The balance check and the debit are 30 ms apart, so two transfers at once can overdraw. | No balance is negative, once requests run in parallel. |

`LATENCY_MS` adds a delay to every response, to try exploration against a slower API.

## Explore it

The **Money** invariant suite opens accounts, moves money between them and closes them in random order, and checks three rules after every step: money is never created or destroyed, no balance is negative, and a closed account stays empty.

```sh
orpheus explore "samples/ledger/Ledger API.json" -e "samples/ledger/Local environment.postman.json" --allow-exploration
```

With every bug on, it finds the self-transfer within a second and cuts it down to three steps: reset, open an account, transfer from it to itself. Run it with `BUGS=negative-amount` or `BUGS=rounding` to find those instead. `closed-account` takes longer, a few thousand calls, because it needs an account opened with exactly 0. With `BUGS=none`, nothing breaks.
