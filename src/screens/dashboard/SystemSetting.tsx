import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { useAuth } from '@/libs/hooks'
import { numberWithCommas } from '@/libs/utils'

type MoneyStatisticType = {
  all_paid_money: number | string
  all_await_to_paid_money: number | string
}
export const SystemSetting = () => {
  const { setting } = useAuth()
  const { t } = useTranslation()

  const { data: moneyData } = useQuery<MoneyStatisticType>('money-statistic')

  return (
    <Box>
      <Typography>
        {t('setting.user_init_score')}
        {setting?.initial_point}
      </Typography>
      <Typography>
        {t('setting.price_per_point')} {numberWithCommas(setting?.price_per_point as number)}đ
      </Typography>
      <Typography>
        {t('setting.limit_exchange_point_per_day')} {setting?.limit_exchange_point_per_day}
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>
        {t('statistic.title_money')}
      </Typography>

      <Typography>
        {t('statistic.all_paid_money')} {numberWithCommas(moneyData?.all_paid_money || 0)}đ
      </Typography>
      <Typography>
        {t('statistic.all_await_to_paid_money')}{' '}
        {numberWithCommas(moneyData?.all_await_to_paid_money || 0)}đ
      </Typography>
    </Box>
  )
}
