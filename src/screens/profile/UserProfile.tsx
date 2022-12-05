import { Box, Typography } from '@mui/material'
import { useAtom } from 'jotai'

import { Card } from '@/components'
import { userAtomWithStorage } from '@/libs/atoms'

export const UserProfile = () => {
  const [userStorage] = useAtom(userAtomWithStorage)
  console.log('user storage', userStorage)
  return (
    <Box>
      <Card title="Thong tin ca nhan" hasMore={false}>
        <Box>
          <Typography>Email: {userStorage?.email} </Typography>
        </Box>
      </Card>
    </Box>
  )
}
