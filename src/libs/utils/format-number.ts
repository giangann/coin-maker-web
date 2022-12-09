import { useAtomValue } from 'jotai'

import { changeCurrencyAtom } from '@/libs/atoms'

export const numberWithCommas = (num: number | string) => {
  if (!num) return 0
  const arr = num.toString().split('.')
  if (arr.length === 1) {
    return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  return arr[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + arr[1]
}

// Do 2 api khác nhau chuyển từ BTC, ETH sang chính nó bị sai :((
export const convertCurrency = (num: number | string, coin_symbol?: string) => {
  const changeCurrency = useAtomValue(changeCurrencyAtom)
  const currency = JSON.parse(localStorage.getItem('currency') as string) || 'usd'
  num = Number(num)

  switch (currency) {
    case 'usd':
      return `$${numberWithCommas(num)}`
    case 'vnd':
      return `${
        changeCurrency?.vnd ? numberWithCommas(roundNumberLastZero(num * changeCurrency?.vnd)) : num
      }₫`
    case 'eth':
      return coin_symbol == 'eth'
        ? '1.0000 ETH'
        : `${
            changeCurrency?.eth
              ? numberWithCommas(roundNumberLastZero(num * changeCurrency?.eth))
              : num
          } ETH`
    case 'btc':
      return coin_symbol == 'btc'
        ? '1.0000 BTC'
        : `${
            changeCurrency?.btc
              ? numberWithCommas(roundNumberLastZero(num * changeCurrency?.btc))
              : num
          } BTC`
    default:
      return `invalid currency`
  }
}

// Làm tròn số thập phân bắt đầu từ số 0 đầu tiên sau dấu phẩy
export const roundNumberLastZero = (num: number | string) => {
  num = Number(num)
  const arr = num.toString().split('.')
  if (arr.length === 1) {
    return num
  }

  if (arr[1][0] != '0') {
    return num.toFixed(4)
  }

  for (let i = 0; i < arr[1].length - 1; i++) {
    if (arr[1][i] == '0' && arr[1][i + 1] != '0') {
      return num.toFixed(4 + i)
    }
  }

  return num.toFixed(4)
}

// Loại phần thập phân
export const removeDecimal = (num: number | string) => {
  return Number(num).toFixed(0)
}
