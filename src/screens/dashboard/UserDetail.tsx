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

      if (res.status === 200) {
        toast.success(res.data.message)
        queryClient.fetchQuery(`user/${params.id}`, { staleTime: 2000 })
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
          <Typography>Role: </Typography>
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
              {'>'} {t('change role')}
            </CurveBoxWithCustomBackground>
          </MenuItem>
        </Stack>
        <Typography>Email: {userInformation?.email}</Typography>
        <Typography>Current score: {userInformation?.score}</Typography>
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
        title={`Update role for user ${userInformation?.name}`}
        open={openDialog}
        handleClose={handleCloseDialog}
        handleSubmit={handleSubmit}
      >
        <Typography sx={{ color: 'black' }}>
          {`Are you sure to set role: ${
            userInformation?.is_admin ? 'USER' : 'ADMIN'
          } for this user?`}
        </Typography>
      </BaseDialog>
    </Card>
  )
}
