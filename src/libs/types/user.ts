export type UserType = {
  email: string
  name?: string
  id: number
  imageUrl?: string
  avatar_url?: string
  score?: number
  avaiable_score?: number
  awaiting_score_to_money?: number
  created_at?: string | Date
}

export type ProfileImage = string | null
