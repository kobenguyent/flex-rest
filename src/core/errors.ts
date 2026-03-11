export class FlexRestError extends Error {
  public readonly status: number
  public readonly url: string
  public readonly data?: any

  constructor(status: number, url: string, data?: any) {
    super(`Server error ${status} received from ${url}`)
    this.name = 'FlexRestError'
    this.status = status
    this.url = url
    this.data = data
  }
}

export function throwOnServerError(res: any, url: string, data?: any) {
  const status = typeof res.status === 'function' ? res.status() : res.status
  if (status >= 500) {
    throw new FlexRestError(status, url, data)
  }
}
