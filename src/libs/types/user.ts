export type UserType = {
  email: string
  name?: string
  id: number
  imageUrl?: string
  avatar_url?: string
  score?: number
  created_at?: string | Date
}

export type ProfileImage = string | null
