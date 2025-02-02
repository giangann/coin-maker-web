import { Box, Button, Grid } from '@mui/material'
import { useUpdateAtom } from 'jotai/utils'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'
// @ts-ignore
import VNnum2words from 'vn-num2words'

import { Card, Chip, PublicIcon } from '@/components'
import { BaseDialog } from '@/components/Dialog/BaseDialog'
import { Input } from '@/components/Input'
import { settingAtom } from '@/libs/atoms/settingAtom'
import { useAuth } from '@/libs/hooks'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { SettingType } from '@/libs/types/setting'
import { BoxFlexStart, BoxHeader } from '@/styles'

import { ManagerScoreToMoneyForm } from './ManagerScoreToMoneyForm'
import { ManagerUser } from './ManagerUser'
import { SystemSetting } from './SystemSetting'

export const AdminDashboard = () => {
  const { t } = useTranslation()
  const { setting } = useAuth()
  const [openDialog, setOpenDialog] = useState(false)

  const handleClose = () => {
    setOpenDialog(false)
  }

  const { control, setValue, handleSubmit, getValues, watch } = useForm<SettingType>({
    defaultValues: {
      id: 0,
      initial_point: setting?.initial_point,
      price_per_point: setting?.price_per_point,
      limit_exchange_point_per_day: setting?.limit_exchange_point_per_day,
      hidden_iframe_link: setting?.hidden_iframe_link,
    },
  })

  const setChangeSettingAtom = useUpdateAtom(settingAtom)
  useQuery<SettingType>('get-setting', {
    onSuccess: (data) => {
      setChangeSettingAtom(data)
      setValue('id', data.id)
      setValue('initial_point', data.initial_point)
      setValue('price_per_point', data.price_per_point)
      setValue('limit_exchange_point_per_day', data.limit_exchange_point_per_day)
      setValue('hidden_iframe_link', data.hidden_iframe_link)
    },
  })

  const onSubmit = async (value: any) => {
    try {
      const res = await request.patch(`setting/${value.id}`, {
        ...value,
      })

      if (res.status === 200) {
        toast.success(res.data.message)
        queryClient.fetchQuery('get-setting', { staleTime: 2000 })
        handleClose()
      }
    } catch (error: any) {
      toast.error(error.errors)
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Card
          title={
            <BoxFlexStart sx={{ alignItems: 'center' }}>
              <BoxHeader sx={{ mr: 2 }}>{t('setting.title')}</BoxHeader>
              <Chip
                hasHover={true}
                handleClick={() => setOpenDialog(true)}
                startIcon={<PublicIcon />}
                content={`${t('Edit')}`}
              />
            </BoxFlexStart>
          }
          hasMore={false}
        >
          <SystemSetting />

          {/* Dialog change setting */}
          <BaseDialog
            title={t('setting.edit_title')}
            defaultAction={false}
            open={openDialog}
            handleClose={handleClose}
          >
            <Grid container component="form" spacing={2}>
              <Grid item xs={12} sm={6}>
                <Input
                  control={control}
                  name="initial_point"
                  required
                  fullWidth
                  label={t('setting.initial_point')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  control={control}
                  name="price_per_point"
                  required
                  fullWidth
                  label={t('setting.price_each_point')}
                  helperText={VNnum2words(10000)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  control={control}
                  name="limit_exchange_point_per_day"
                  required
                  fullWidth
                  label={t('setting.limit_exchange_point_per_day')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Input
                  control={control}
                  name="hidden_iframe_link"
                  required
                  fullWidth
                  label={t('setting.hidden_iframe_link')}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={handleClose} variant="outlined">
                    {t('cancel')}
                  </Button>
                  <Button
                    color="primary"
                    sx={{ ml: 1 }}
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                  >
                    {t('submit')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </BaseDialog>
        </Card>
      </Box>
      <Box sx={{ mb: 3 }}>
        <ManagerScoreToMoneyForm />
      </Box>
      <Box>
        <ManagerUser />
      </Box>
    </Box>
  )
}
