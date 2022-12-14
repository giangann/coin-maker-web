import { UnknownObj } from '@/components/AutoComplete'

export type NotificationType<T = UnknownObj> = {
  id: string
  content: string
  status: number
  model_id: number
  model_type: string
  type: number
  created_at: string
  updated_at: string
  sender_name: string
}

// export const
