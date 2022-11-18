import { atom } from 'jotai'

import { IExchangeRates } from '../types'

const exchangeRatesAtom = atom<{ [key: string]: IExchangeRates }>({
  btc: {
    name: 'Bitcoin',
    unit: 'BTC',
    value: 1,
    type: 'crypto',
  },
  usd: {
    name: 'US Dollar',
    unit: '$',
    value: 16915.759,
    type: 'fiat',
  },
})

export { exchangeRatesAtom }
