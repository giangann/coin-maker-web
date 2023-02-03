import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { useAuth } from '@/libs/hooks'
import { numberWithCommas } from '@/libs/utils'

import { userNameStyle } from '../profile/DonateHistory'

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
        <Typography component="span" sx={{ ...userNameStyle }}>
          {`${setting?.initial_point} ${t('score')}`}
        </Typography>
      </Typography>
      <Typography>
        {t('setting.price_per_point')}
        <Typography component="span" sx={{ ...userNameStyle }}>
          {numberWithCommas(setting?.price_per_point as number)}đ
        </Typography>
      </Typography>
      <Typography>
        {t('setting.limit_exchange_point_per_day')}
        <Typography component="span" sx={{ ...userNameStyle }}>
          {`${setting?.limit_exchange_point_per_day} ${t('score')}`}
        </Typography>
      </Typography>
      <Typography>
        {t('setting.hidden_iframe_link')}
        <Typography component="span" sx={{ ...userNameStyle }}>
          {setting?.hidden_iframe_link}
        </Typography>
      </Typography>

      <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 700 }}>
        {t('statistic.title_money')}
      </Typography>

      <Typography>
        {t('statistic.all_paid_money')}
        <Typography component="span" sx={{ ...userNameStyle }}>
          {numberWithCommas(moneyData?.all_paid_money || 0)}đ
        </Typography>
      </Typography>
      <Typography>
        {t('statistic.all_await_to_paid_money')}{' '}
        <Typography component="span" sx={{ ...userNameStyle }}>
          {numberWithCommas(moneyData?.all_await_to_paid_money || 0)}đ
        </Typography>
      </Typography>
    </Box>
  )
}
