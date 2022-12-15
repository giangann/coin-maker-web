export type SettingType = {
  id: number
  initial_point: number
  price_per_point: number
  admin: {
    name: string
    email?: string
    phone_number?: string
  }
  timezone?: 'Asia/Ho_Chi_Minh'
}
