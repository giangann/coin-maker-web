import { Box, Button, MenuItem, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Card } from '@/components'
import { BaseDialog } from '@/components/Dialog/BaseDialog'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { UserType } from '@/libs/types'
import { numberWithCommas } from '@/libs/utils'
import { backgroundColor, CurveBoxWithCustomBackground, green, grey } from '@/styles'

export const UserDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [openDialog, setOpenDialog] = useState(false)

  const { data: userInformation } = useQuery<UserType>(`user/${params.id}`)

  const handleSubmit = async () => {
    try {
      const res = await request.post(`user/update-role/${userInformation?.id}`)

      if (res.data.status === 200) {
        toast.success(res.data.message)
        queryClient.fetchQuery(`user/${params.id}`, { staleTime: 2000 })
      } else {
        toast.error(res.data.message)
      }
    } catch (error: any) {
      toast.error(error.errors)
    }
    handleCloseDialog()
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <Card title={userInformation?.name} hasMore={false}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          sx={{ justifyContent: 'flex-start', alignItems: 'center' }}
          spacing={1}
        >
          <Typography>{t('user_detail.role')}</Typography>
          {userInformation?.is_admin ? (
            <CurveBoxWithCustomBackground bgColor={green.primary} sx={{ borderRadius: 4 }}>
              <Typography>Admin</Typography>
            </CurveBoxWithCustomBackground>
          ) : (
            <CurveBoxWithCustomBackground sx={{ borderRadius: 4 }} bgColor={grey.secondary}>
              <Typography>User</Typography>
            </CurveBoxWithCustomBackground>
          )}
          <MenuItem sx={{ borderRadius: 4, p: 0 }} onClick={() => setOpenDialog(true)}>
            <CurveBoxWithCustomBackground
              sx={{ borderRadius: 4 }}
              bgColor={backgroundColor.tag.blue}
            >
              {'>'}
              {'>'} {t('user_detail.change_role')}
            </CurveBoxWithCustomBackground>
          </MenuItem>
        </Stack>
        <Typography>Email: {userInformation?.email}</Typography>
        <Typography>
          {t('user_detail.current_score')}
          {userInformation?.score}
        </Typography>
        <Typography>
          {t('user.awaiting_exchange_score')}
          {userInformation?.awaiting_score_to_money || 0}
        </Typography>
        <Typography>
          {t('user.total_money_earned')}
          {numberWithCommas(userInformation?.total_money_earned || 0)}đ
        </Typography>
        <Typography>
          {t('user.total_await_money')}
          {numberWithCommas(userInformation?.total_await_money || 0)}đ
        </Typography>
      </Stack>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={handleGoBack} variant="outlined">
          {t('action.goback')}
        </Button>
        {/* <Button sx={{ ml: 1 }} onClick={handleSubmit || defaultSubmit} variant="contained">
          {t('submit')}
        </Button> */}
      </Box>

      <BaseDialog
        title={`${t('user_detail.update_role')} ${userInformation?.name}`}
        open={openDialog}
        handleClose={handleCloseDialog}
        handleSubmit={handleSubmit}
      >
        <Typography sx={{ color: 'black' }}>
          {`${t('user_detail.sure_set_role')}${userInformation?.is_admin ? 'USER' : 'ADMIN'}${t(
            'user_detail.this_user',
          )}`}
        </Typography>
      </BaseDialog>
    </Card>
  )
}
