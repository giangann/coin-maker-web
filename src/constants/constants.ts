import { UnknownObj } from '@/components/AutoComplete'
import i18n from '@/libs/lang/translations/i18n'

export const adminEmail = 'gta007md@gmail.com'

export const STATUS_LIKE = {
  NO_REACT: 0,
  LIKE: 1,
  DISLIKE: 2,
}

export const TAG_POST = {
  BULLISH: 0,
  BEARISH: 1,
  UNSET: 2,
}
export const cryptoApiHeaders = {
  'x-rapidapi-host': 'coinranking1.p.rapidapi.com',
  'x-rapidapi-key': '04de44fc83msh46cb01efcfaa973p1fba02jsndd85800cb112',
}

export const coinMarketApiHeader = {
  'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
}
export const baseUrl = 'https://coinranking1.p.rapidapi.com'
export const optionTimeFilter = ['24h', '3h', '7d', '30d', '3m', '1y']
export const optionTimeFilterGecko = {
  '24h': 1,
  '3h': 1,
  '7d': 7,
  '30d': 30,
  '3m': 90,
  '1y': 365,
}
export const defaultReferenceCurrency = 'yhjMzLPhuIDl'

export const CURRENCIES: { [key: string]: string } = {
  usd: '$',
  vnd: '₫',
  eth: 'ETH',
  btc: 'BTC',
}

export const DEFAULT_POINTS_DONATE = 1

export const DEFAULT_CONVERT_UNIT = {
  ORIGIN: 'btc',
  DEST: 'usd',
}
export const STATUS_FORM = {
  ACCEPTED: 1,
  AWAIT_CONFIRM: 0,
  REJECTED: 2,
}

export const STATUS_FORM_OPTIONS = [
  { label: i18n.t('accepted'), value: STATUS_FORM.ACCEPTED },
  { label: i18n.t('await_confirm'), value: STATUS_FORM.AWAIT_CONFIRM },
  { label: i18n.t('rejected'), value: STATUS_FORM.REJECTED },
]

export const STATUS_NOTIFICATION = {
  UNREAD: 0,
  READ: 1,
  NEW: 2,
}

export const NOTI_MODEL_TYPE = {
  DONATE: 'Donate',
  SCORE_TO_MONEY_FORM: 'ScoreToMoneyForm',
  POST: 'Post',
}

export const NOTI_TYPE: UnknownObj = {
  DONATE: 0,
  CREATE: 1,
  UPDATE: 2,
  ACCEPT: 3,
  REJECT: 4,
}
