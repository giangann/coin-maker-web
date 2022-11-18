export interface ICoin {
  id: string
  name: string
  symbol: string
  categories: string[]
  market_cap_rank: string | number
  description: IDescription
  image: IImageCoin
  market_data: IMarketData
  platforms: { [key: string]: string }
  detail_platforms: IDetailPlatforms
  links: ILinks
  current_price: number
  price_change_percentage_24h: number
  is_in_watch_list?: boolean
}

export interface ICoinLaravel {
  id: string
  name: string
  symbol: string
  uuid: string
  is_in_watch_list?: boolean
}

export interface IImageCoin {
  large: string
  small: string
  thumb: string
}

export interface IMarketData {
  current_price: ICurrentPrice
  circulating_supply: number
  total_supply: number
  total_volume: ITotalVolume
  price_change_percentage_24h: number
  price_change_percentage_7d: number
  price_change_percentage_14d: number
  market_cap: IMarketCap
}

export interface IMarketCap {
  usd: number
  eth: number
  vnd: number
  btc: number
}

export interface IDescription {
  en: string
  vi: string
}

export interface ICurrentPrice {
  usd: number
  eth: number
  vnd: number
  btc: number
}

export interface ITotalVolume {
  usd: number
  eth: number
  vnd: number
  btc: number
}

export interface ILinks {
  homepage: string[]
  blockchain_site: string[]
  repos_url: {
    github: string[]
  }
}

export interface IDetailPlatforms {
  [key: string]: {
    contract_address: string
    decimal_place: number
  }
}

export interface IChangeCurrency {
  usd: number
  btc: number
  eth: number
  vnd: number
}

export interface IExchangeRates {
  name: string
  unit: string
  value: number
  type: string
}
