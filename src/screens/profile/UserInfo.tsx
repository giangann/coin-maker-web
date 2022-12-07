import { Box, Typography } from '@mui/material'
import { useAtom } from 'jotai'

import { Card } from '@/components'
import { userAtomWithStorage } from '@/libs/atoms'

export const UserInfo = () => {
  const [userStorage] = useAtom(userAtomWithStorage)

  return (
    <Card title="Thong tin ca nhan" hasMore={false}>
      <Box>
        <Typography>Email: {userStorage?.email} </Typography>
        <Typography>Current score: {userStorage?.score} </Typography>
      </Box>
    </Card>
  )
}
