export function throwOnServerError(res: any, url: string) {
  if (res.status >= 500) {
    throw new Error(`Server error ${res.status} received from ${url}`)
  }
}
