// @ts-nocheck

import { Box, Button, Grid, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { STATUS_FORM } from '@/constants'
import { useAuth } from '@/libs/hooks'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { numberWithCommas } from '@/libs/utils'

import { Select } from '../AutoComplete'
import { Input } from '../Input'

export type ScoreToMoneyFormType = {
  points: number | string
  bank_name: string
  bank_number: number | string
  bank_owner?: string
  bank_branch?: string
  name: string
  phone_number: number | string
}

export const ScoreToMoneyForm = (props: any) => {
  const { handleClose } = props
  const { userStorage } = useAuth()
  const { data: listBanksData } = useQuery([`https://api.vietqr.io/v2/banks`])

  const { t } = useTranslation()
  const { setting } = useAuth()
  // @ts-ignore
  const bankOptions = listBanksData?.data?.map((item, index) => {
    return {
      value: item.short_name,
      label: item.short_name,
    }
  })
  const { control, handleSubmit, getValues, watch } = useForm<ScoreToMoneyFormType>({
    defaultValues: {
      points: 1,
      bank_name: '',
      bank_number: '',
      bank_owner: '',
      bank_branch: '',
      name: userStorage?.name,
      phone_number: '',
    },
  })

  const onSubmit = async (value: ScoreToMoneyFormType) => {
    try {
      const res = await request.post('score-to-money-form', {
        ...value,
        user_id: userStorage?.id,
        status: STATUS_FORM.AWAIT_CONFIRM,
        money: watch('points') * setting?.price_per_point,
      })

      console.log('result', res)

      if (res.status === 200) {
        toast.success(res.data.message)
        queryClient.fetchQuery(`score-to-money-form`, { staleTime: 2000 })
        queryClient.fetchQuery(`user/calculate-score`, { staleTime: 2000 })
      }
    } catch (error: any) {
      console.log('error', error)
      toast.error(error.errors)
    }
    handleClose()
  }
  return (
    <Grid container component="form" rowSpacing={1} onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={12} sx={{ mb: 4 }}>
        <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
          <Typography sx={{ color: 'black' }}>
            Tỉ lệ đổi: 1 điểm = {numberWithCommas(setting?.price_per_point)}đ
          </Typography>
          <Input
            sx={{ borderRadius: 6 }}
            type="number"
            fullWidth
            name="points"
            control={control}
            required
            placeholder="Nhập số điểm muốn đổi"
          />
          <Typography sx={{ color: 'black' }}>
            Số tiền bạn sẽ nhận được là:{' '}
            {numberWithCommas((watch('points') as number) * setting?.price_per_point)}đ{' '}
          </Typography>
        </Box>
      </Grid>

      <Typography sx={{ color: 'black' }}>Thông tin ngân hàng nhận tiền</Typography>
      <Grid item xs={12} sx={{ mb: 4 }} container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Select
            sx={{ color: 'black !important' }}
            placeholder="Chọn ngân hàng"
            options={bankOptions}
            name="bank_name"
            control={control}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            type="number"
            fullWidth
            name="bank_number"
            control={control}
            required
            placeholder="Nhập số tài khoản"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input fullWidth name="bank_owner" control={control} required placeholder="Tên chủ thẻ" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            name="bank_branch"
            control={control}
            required
            placeholder="Tên chi nhánh"
          />
        </Grid>
      </Grid>
      <Typography sx={{ color: 'black' }}>Thông tin liên hệ</Typography>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Input fullWidth name="name" control={control} required placeholder="Họ và tên" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            type="number"
            fullWidth
            name="phone_number"
            control={control}
            required
            placeholder="Số điện thoại"
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} variant="outlined">
            {t('cancel')}
          </Button>
          <Button sx={{ ml: 1 }} type="submit" variant="contained">
            {t('submit')}
          </Button>
        </Box>
      </Grid>
    </Grid>
  )
}
