import { Box, MenuItem, Stack, Typography } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { Card } from '@/components'
import { BaseDialog } from '@/components/Dialog/BaseDialog'
import { ScoreToMoneyForm, ScoreToMoneyFormType } from '@/components/Form'
import { userAtomWithStorage } from '@/libs/atoms'
import { useAuth } from '@/libs/hooks'
import { numberWithCommas } from '@/libs/utils'
import { backgroundColor, CurveBoxWithCustomBackground } from '@/styles'

export const darkTheme = createTheme({
  palette: {
    text: {
      primary: '#000',
    },
  },
})
export const UserInfo = () => {
  const [userStorage] = useAtom(userAtomWithStorage)

  const [openDialog, setOpenDialog] = useState(false)
  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleSubmitForm = async (value: ScoreToMoneyFormType) => {
    console.log(value)
  }

  const { setting } = useAuth()

  const { t } = useTranslation()

  const { data: scoreData } = useQuery<any>('user/calculate-score')
  return (
    <Card title={t('user.info')} hasMore={false}>
      <Box>
        <Typography>
          {t('user.email')} {userStorage?.email}{' '}
        </Typography>
        <Typography>
          {t('user.curr_score')} {scoreData?.score}{' '}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
          <Typography>
            {t('user.avaiable_score')} {scoreData?.avaiable_score}{' '}
          </Typography>
          <MenuItem sx={{ borderRadius: 4, p: 0 }} onClick={() => setOpenDialog(true)}>
            <CurveBoxWithCustomBackground
              sx={{ borderRadius: 4 }}
              bgColor={backgroundColor.tag.blue}
            >
              {'>'}
              {'>'} {t('form.money_exchange')}
            </CurveBoxWithCustomBackground>
          </MenuItem>
        </Stack>
        <Typography>
          {t('user.awaiting_exchange_score')} {scoreData?.awaiting_score_to_money}{' '}
        </Typography>
        <Typography>
          {t('user.total_money_earned')} {numberWithCommas(scoreData?.money_earned)}
          {'đ '}
        </Typography>
        <Typography>
          {t('user.total_await_money')} {numberWithCommas(scoreData?.awaiting_money)}
          {'đ '}
        </Typography>
      </Box>

      <BaseDialog
        open={openDialog}
        handleClose={handleClose}
        title={t('form.score_to_money')}
        handleSubmit={handleSubmitForm}
        submitAction={t('action.submit')}
        defaultAction={false}
        fullWidth
      >
        <ThemeProvider theme={darkTheme}>
          <ScoreToMoneyForm handleClose={handleClose} scoreData={scoreData} />
        </ThemeProvider>
      </BaseDialog>
    </Card>
  )
}
