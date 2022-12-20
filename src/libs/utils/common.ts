import { formatDistance, Locale } from 'date-fns'
import { enUS, ja, vi } from 'date-fns/locale'

const language = localStorage.getItem('language') || 'vi'

type localeType = {
  [key: string]: Locale
}

const locale: localeType = {
  vi: vi,
  en: enUS,
  ja: ja,
}

export const filterEmptySrting = (arr: string[]) => {
  return arr.filter((item) => item !== '')
}

export const removeHttp = (url: string) => {
  return url.replace(/^(https?:)\/\//, '')
}

export const removeSlash = (url: string) => {
  return url.replace(/\/$/, '')
}

export const removeHttpAndSlash = (url: string) => {
  return removeSlash(removeHttp(url))
}

export const removeDash = (str: string) => {
  return str.replace(/-/g, ' ')
}

export const formatTimeDiff = (dateTime: Date | string) => {
  return formatDistance(new Date(dateTime), new Date(), {
    addSuffix: true,
    locale: locale[language],
  })
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
