import http from 'node:http'

const orders = [
  { id: 'ord_1042', status: 'open', customerId: 'cus_2817', currency: 'EUR', total: 129.5, items: 3, createdAt: '2026-10-11T09:24:13Z' },
  { id: 'ord_1041', status: 'open', customerId: 'cus_1930', currency: 'EUR', total: 48.0, items: 1, createdAt: '2026-10-11T08:02:51Z' },
  { id: 'ord_1039', status: 'open', customerId: 'cus_0412', currency: 'EUR', total: 312.75, items: 6, createdAt: '2026-10-10T17:45:09Z' },
  { id: 'ord_1036', status: 'open', customerId: 'cus_2817', currency: 'EUR', total: 19.9, items: 1, createdAt: '2026-10-10T11:12:40Z' },
]

const wait = ms => new Promise(r => setTimeout(r, ms))

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost')
  let raw = ''
  for await (const chunk of req) raw += chunk
  await wait(40 + Math.random() * 80)
  const send = (status, data, extra = {}) => {
    res.writeHead(status, { 'Content-Type': 'application/json', 'X-Request-Id': 'req_' + Math.random().toString(36).slice(2, 10), 'Cache-Control': 'no-store', ...extra })
    res.end(JSON.stringify(data, null, 2))
  }
  const p = url.pathname
  if (p === '/health') return send(200, { status: 'ok', version: '2.14.0', uptimeSeconds: 86412 })
  if (p === '/v1/orders' && req.method === 'GET') {
    const limit = Number(url.searchParams.get('limit') ?? 20)
    return send(200, { total: orders.length, page: 1, pageSize: limit, items: orders.slice(0, limit) })
  }
  if (p === '/v1/orders' && req.method === 'POST') {
    let body = {}
    try { body = JSON.parse(raw || '{}') } catch {}
    if (!body.customerId) return send(422, { error: 'validation_failed', fields: { customerId: 'is required' } })
    return send(201, { id: 'ord_1043', status: 'open', ...body, total: 74.0, createdAt: new Date().toISOString() }, { Location: '/v1/orders/ord_1043' })
  }
  const m = p.match(/^\/v1\/orders\/([\w]+)$/)
  if (m) {
    const order = orders.find(o => o.id === m[1])
    if (!order) return send(404, { error: 'not_found' })
    if (req.method === 'DELETE') return send(200, { ...order, status: 'cancelled' })
    return send(200, { ...order, lines: [{ sku: 'LYRE-01', name: 'Concert lyre', quantity: 1, price: 99.5 }, { sku: 'STRING-SET', name: 'Gut string set', quantity: 2, price: 15 }] })
  }
  const c = p.match(/^\/v1\/customers\/([\w]+)$/)
  if (c) return send(200, { id: c[1], name: 'Ada Lovelace', email: 'ada@example.com', country: 'GR', since: '2024-03-18' })
  send(404, { error: 'not_found' })
})

// PORT=0 picks a free port; the port is printed so tests can find it.
server.listen(Number(process.env.PORT ?? 4010), '127.0.0.1', () => console.log(`mock api on ${server.address().port}`))
