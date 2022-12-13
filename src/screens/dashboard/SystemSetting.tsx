import { Box, Typography } from '@mui/material'

import { useAuth } from '@/libs/hooks'
import { numberWithCommas } from '@/libs/utils'

export const SystemSetting = () => {
  const { setting } = useAuth()
  console.log('setting', setting)
  return (
    <Box>
      <Typography>Initial score of each user: {setting?.initial_point}</Typography>
      <Typography>
        Price per point: {numberWithCommas(setting?.price_per_point as number)}đ
      </Typography>
    </Box>
  )
}
