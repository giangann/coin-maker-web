import { UserType } from './user'

export interface IComment {
  id: string | number
  post_id: string | number
  user_id: string | number
  content: string
  updated_at: string

  user: UserType
}

export interface IPost {
  id: number
  coin_id: string
  user_id: number
  content: string
  image: string
  updated_at: string
  count_like: number
  count_comment: number
  tag: number

  user: UserType
  is_liked: boolean
  is_donated: boolean
}
