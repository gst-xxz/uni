import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const buildUrlWithParams = (params: Record<string, string | number | boolean>) => {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
