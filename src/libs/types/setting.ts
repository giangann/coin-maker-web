export type SettingType = {
  id: number
  initial_point: number
  price_per_point: number
  limit_exchange_point_per_day: number
  admin: {
    name: string
    email?: string
    phone_number?: string
  }
  timezone?: 'Asia/Ho_Chi_Minh'
  hidden_iframe_link?: string
}
