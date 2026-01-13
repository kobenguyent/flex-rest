import * as fs from 'fs'
import * as path from 'path'


const DEFAULT_LOG = path.resolve('output/api_logs.txt')

export function logRequest(
  method: string,
  url: string,
  headers: object,
  payload?: any,
  response?: any,
  logFile = DEFAULT_LOG
) {
  const entry = `[${new Date().toISOString()}] ${method.toUpperCase()} ${url}
Headers: ${JSON.stringify(headers)}
${payload ? `Payload: ${JSON.stringify(payload)}\n` : ''}
${response ? `Status: ${response.status}\nResponse: ${JSON.stringify(response.data)}\n` : ''}
\n`
  fs.appendFile(logFile, entry, () => {})
}
