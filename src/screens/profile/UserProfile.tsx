import { Box } from '@mui/material'
import { useAtom } from 'jotai'
import { useQuery } from 'react-query'

import { userAtomWithStorage } from '@/libs/atoms'

import { DonateHistory } from './DonateHistory'
import { UserInfo } from './UserInfo'

type Setting = {
  price_per_point: number
  initial_point: number
}
export const UserProfile = () => {
  const [userStorage] = useAtom(userAtomWithStorage)

  const { data: settings } = useQuery<Setting[]>([`get-setting`])

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <UserInfo />
      </Box>
      <Box>
        <DonateHistory />
      </Box>
    </Box>
  )
}
