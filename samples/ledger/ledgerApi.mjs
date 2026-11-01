import http from 'node:http'

// Bugs planted on purpose, for invariant testing to find. BUGS=all (the default), none, or a comma list.
const BUG_NAMES = ['self-transfer', 'negative-amount', 'rounding', 'closed-account', 'overdraft-race']
const wanted = (process.env.BUGS ?? 'all').split(',').map(name => name.trim()).filter(Boolean)
const bugs = new Set(wanted.includes('all') ? BUG_NAMES : wanted.filter(name => BUG_NAMES.includes(name)))
const latencyMs = Number(process.env.LATENCY_MS ?? 0)

let accounts = new Map()
let transfers = []
let nextAccount = 1
let nextTransfer = 1

const wait = ms => new Promise(r => setTimeout(r, ms))
const toCents = amount => Math.round(amount * 100)
const toAmount = cents => cents / 100
const view = account => ({ id: account.id, owner: account.owner, status: account.status, balance: toAmount(account.balance) })

/** A positive amount with at most two decimals, or a reason it isn't one. */
function amountProblem(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) return 'must be a number'
  if (Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-6) return 'has more than two decimals'
  if (amount <= 0 && !(amount < 0 && bugs.has('negative-amount'))) return 'must be more than 0'
  return null
}

async function transfer(body, send) {
  const { from, to, amount } = body
  const problem = amountProblem(amount)
  if (problem) return send(422, { error: 'validation_failed', fields: { amount: problem } })
  const source = accounts.get(from)
  const target = accounts.get(to)
  if (!source || !target) return send(404, { error: 'account_not_found', id: source ? to : from })
  if (from === to && !bugs.has('self-transfer')) return send(422, { error: 'same_account' })
  if (source.status !== 'open' || (target.status !== 'open' && !bugs.has('closed-account'))) return send(409, { error: 'account_closed' })

  const cents = toCents(amount)
  if (source.balance < cents) return send(409, { error: 'insufficient_funds', balance: toAmount(source.balance) })
  if (bugs.has('overdraft-race')) await wait(30)

  const debit = bugs.has('rounding') ? Math.trunc(amount) * 100 : cents
  if (from === to) {
    source.balance += cents
  } else {
    source.balance -= debit
    target.balance += cents
  }
  const record = { id: `trf_${nextTransfer++}`, from, to, amount, at: new Date().toISOString() }
  transfers.push(record)
  send(201, record)
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  let raw = ''
  for await (const chunk of req) raw += chunk
  if (latencyMs) await wait(latencyMs)
  const send = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' })
    res.end(JSON.stringify(data, null, 2))
  }
  let body = {}
  if (raw) {
    try { body = JSON.parse(raw) } catch { return send(400, { error: 'invalid_json' }) }
  }

  const p = url.pathname
  const m = req.method
  if (p === '/health') return send(200, { status: 'ok', bugs: [...bugs] })
  if (p === '/reset' && m === 'POST') {
    accounts = new Map()
    transfers = []
    nextAccount = 1
    nextTransfer = 1
    return send(200, { reset: true })
  }
  if (p === '/accounts' && m === 'GET') return send(200, { items: [...accounts.values()].map(view) })
  if (p === '/accounts' && m === 'POST') {
    if (typeof body.owner !== 'string' || !body.owner.trim()) return send(422, { error: 'validation_failed', fields: { owner: 'is required' } })
    const deposit = body.deposit ?? 0
    const problem = deposit === 0 ? null : amountProblem(deposit)
    if (problem || deposit < 0) return send(422, { error: 'validation_failed', fields: { deposit: problem ?? 'must not be negative' } })
    const account = { id: `acc_${nextAccount++}`, owner: body.owner.trim(), status: 'open', balance: toCents(deposit) }
    accounts.set(account.id, account)
    return send(201, view(account))
  }
  const one = p.match(/^\/accounts\/([\w-]+)$/)
  if (one && m === 'GET') {
    const account = accounts.get(one[1])
    return account ? send(200, view(account)) : send(404, { error: 'account_not_found', id: one[1] })
  }
  const close = p.match(/^\/accounts\/([\w-]+)\/close$/)
  if (close && m === 'POST') {
    const account = accounts.get(close[1])
    if (!account) return send(404, { error: 'account_not_found', id: close[1] })
    if (account.status === 'closed') return send(409, { error: 'already_closed' })
    if (account.balance !== 0) return send(409, { error: 'balance_not_zero', balance: toAmount(account.balance) })
    account.status = 'closed'
    return send(200, view(account))
  }
  if (p === '/transfers' && m === 'GET') return send(200, { items: transfers })
  if (p === '/transfers' && m === 'POST') return transfer(body, send)
  send(404, { error: 'not_found' })
})

// PORT=0 picks a free port; the port is printed so tests can find it.
server.listen(Number(process.env.PORT ?? 4020), '127.0.0.1', () => console.log(`ledger api on ${server.address().port}`))
