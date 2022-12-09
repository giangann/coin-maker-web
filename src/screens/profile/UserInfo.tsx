import { Box, MenuItem, Stack, Typography } from '@mui/material'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { Card } from '@/components'
import { BaseDialog } from '@/components/Dialog/BaseDialog'
import { ScoreToMoneyForm, ScoreToMoneyFormType } from '@/components/Form'
import { userAtomWithStorage } from '@/libs/atoms'
import { useAuth } from '@/libs/hooks'
import { backgroundColor, CurveBoxWithCustomBackground } from '@/styles'

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
  console.log('setting', setting)

  const { t } = useTranslation()

  const { data: scoreData } = useQuery<any>('user/calculate-score')
  return (
    <Card title="Thong tin ca nhan" hasMore={false}>
      <Box>
        <Typography>Email: {userStorage?.email} </Typography>
        <Typography>Current score: {scoreData?.score} </Typography>
        <Stack direction="row" alignItems="center" spacing={1} mt={1}>
          <Typography>Current avaiable score: {scoreData?.avaiable_score} </Typography>
          <MenuItem sx={{ borderRadius: 4, p: 0 }} onClick={() => setOpenDialog(true)}>
            <CurveBoxWithCustomBackground
              sx={{ borderRadius: 4 }}
              bgColor={backgroundColor.tag.blue}
            >
              {'>'}
              {'>'} yêu cầu đổi điểm
            </CurveBoxWithCustomBackground>
          </MenuItem>
        </Stack>
        <Typography>Awaiting exchange score: {scoreData?.awating_score_to_money} </Typography>
      </Box>

      <BaseDialog
        open={openDialog}
        handleClose={handleClose}
        title={'Đổi điểm lấy tiền'}
        handleSubmit={handleSubmitForm}
        submitAction={'Xác nhận'}
        defaultAction={false}
        fullWidth
      >
        <ScoreToMoneyForm handleClose={handleClose} />
      </BaseDialog>
    </Card>
  )
}
