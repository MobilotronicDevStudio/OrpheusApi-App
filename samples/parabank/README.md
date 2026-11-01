# ParaBank sample

[ParaBank](https://hub.docker.com/r/parasoft/parabank) is Parasoft's demo bank, made for trying testing tools. Unlike the [Ledger sample](../ledger/README.md), nobody planted its bugs for us, so it shows how invariant testing does on an API we didn't write.

1. Start it with Docker: `docker run -d --name parabank -p 8080:8080 parasoft/parabank`. It takes a few seconds to come up.
2. In Orpheus, choose **Load Collection** in the collection menu and pick `ParaBank.json`.
3. From the **Environments** menu, import `Local environment.postman.json` as a Postman environment, then pick it under **Uses environment**. It logs in as ParaBank's demo customer, `john`.

The **Happy path** execution plan resets the database, logs in, and moves 25 between John's first two accounts.

**Initialize database** puts the demo data back. Run it whenever the data gets into a state you don't want. The REST API's OpenAPI description is at `http://localhost:8080/parabank/services/bank/openapi.json`.

## What it gets wrong

Tried by hand with the image from October 2026:

| Request | What happens |
|---|---|
| Transfer of `0.005` | Accepted with 200. Both accounts then answer 500 until the database is reset. |
| Transfer of `-500` | Accepted, and moves the money the other way. |
| Transfer of more than the balance | Accepted, and the account goes negative. The demo data already has negative balances, so this may be on purpose. |
| Transfer to the same account | Accepted with 200, with no change. |

The first is the kind of bug invariant testing is for: no single response looks wrong, but a rule like "an account can always be read back" breaks on the next request.

## Explore it

The **Money** invariant suite moves money around John's accounts with transfers, deposits, withdrawals and new accounts, and checks that the total only changes with deposits and withdrawals, and that no response is a 5xx.

```sh
orpheus explore samples/parabank/ParaBank.json -e "samples/parabank/Local environment.postman.json" --allow-exploration
```

In a few seconds it finds a bug we hadn't found by hand: a deposit of `0.025` is accepted, and from then on listing the accounts answers 500. It cuts the sequence down to that one deposit.
