import * as http from 'http'

export function createTestServer(): http.Server {
  return http.createServer((req, res) => {
    const { method, url } = req
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })
    req.on('end', () => {
      try {
        const data = body ? JSON.parse(body) : {}

        if (method === 'GET' && url === '/users') {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify([{ id: 1, name: 'John' }]))
        } else if (method === 'POST' && url === '/users') {
          res.writeHead(201, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ id: 2, ...data }))
        } else if (method === 'PUT' && url === '/users/1') {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ id: 1, ...data }))
        } else if (method === 'PATCH' && url === '/users/1') {
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ id: 1, ...data }))
        } else if (method === 'DELETE' && url === '/users/1') {
          res.writeHead(204)
          res.end()
        } else if (method === 'HEAD' && url === '/users') {
          res.writeHead(200, { 'x-total-count': '1' })
          res.end()
        } else if (url === '/error') {
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Internal Server Error' }))
        } else if (method === 'GET' && url === '/auth') {
          const auth = req.headers['authorization'] ?? ''
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ auth }))
        } else {
          res.writeHead(404)
          res.end()
        }
      } catch {
        res.writeHead(500)
        res.end()
      }
    })
  })
}

export async function startServer(server: http.Server): Promise<string> {
  return new Promise(resolve => {
    server.listen(0, () => {
      const addr = server.address() as { port: number }
      resolve(`http://localhost:${addr.port}`)
    })
  })
}

export async function stopServer(server: http.Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close(err => (err ? reject(err) : resolve()))
  })
}
