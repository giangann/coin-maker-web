import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@/libs/hooks'
import { numberWithCommas } from '@/libs/utils'

export const SystemSetting = () => {
  const { setting } = useAuth()
  const { t } = useTranslation()

  return (
    <Box>
      <Typography>
        {t('setting.user_init_score')}
        {setting?.initial_point}
      </Typography>
      <Typography>
        {t('setting.price_per_point')} {numberWithCommas(setting?.price_per_point as number)}đ
      </Typography>
    </Box>
  )
}
