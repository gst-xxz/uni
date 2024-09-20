export const buildUrlWithParams = (params: Record<string, string | number | boolean>) => {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
}
