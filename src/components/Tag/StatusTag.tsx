import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { STATUS_FORM } from '@/constants'
import { backgroundColor, CurveBoxWithCustomBackground } from '@/styles'

export const StatusTag = (props: { value: number }) => {
  const { value } = props
  const { t } = useTranslation()
  if (value === STATUS_FORM.ACCEPTED)
    return (
      <CurveBoxWithCustomBackground
        sx={{ width: 'fit-content' }}
        bgColor={backgroundColor.tag.green}
      >
        <Typography>{t('accepted')}</Typography>
      </CurveBoxWithCustomBackground>
    )
  if (value === STATUS_FORM.REJECTED)
    return (
      <CurveBoxWithCustomBackground sx={{ width: 'fit-content' }} bgColor={backgroundColor.tag.red}>
        <Typography>{t('rejected')}</Typography>
      </CurveBoxWithCustomBackground>
    )
  return (
    <CurveBoxWithCustomBackground
      sx={{ width: 'fit-content' }}
      bgColor={backgroundColor.tag.yellow}
    >
      <Typography>{t('await_confirm')}</Typography>
    </CurveBoxWithCustomBackground>
  )
}
