// @ts-nocheck

import { Box, Button, Grid, Typography } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import { STATUS_FORM } from '@/constants'
import { useAuth } from '@/libs/hooks'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { numberWithCommas } from '@/libs/utils'
import { darkTheme } from '@/screens/profile/UserInfo'

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

export type ScoreToMoneyFormProps = {
  handleClose?: any
  themeStyle?: 'light' | 'dark'
}
export const ScoreToMoneyForm = (props: ScoreToMoneyFormProps & any) => {
  const { handleClose, themeStyle } = props
  const { userStorage } = useAuth()
  const { data: listBanksData } = useQuery([`https://api.vietqr.io/v2/banks`])
  const { t } = useTranslation()
  const { setting } = useAuth()
  const params = useParams()
  const navigate = useNavigate()
  // @ts-ignore
  const bankOptions = listBanksData?.data?.map((item, index) => {
    return {
      value: item.short_name,
      label: item.short_name,
    }
  })
  const { control, handleSubmit, getValues, watch, setValue } = useForm<ScoreToMoneyFormType>({
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

  // check is user_edit/user_create/admin_view
  const isEdit = params.id ? true : false
  console.log('id of form', params.id)

  if (isEdit) {
    useQuery(`score-to-money-form/${params.id}`, {
      onSuccess: (data: any) => {
        console.log('value', data)
        setValue('points', data.points)
        setValue('bank_name', data.bank_name)
        setValue('bank_number', data.bank_number)
        setValue('bank_owner', data.bank_owner)
        setValue('bank_branch', data.bank_branch)
        setValue('name', data.name)
        setValue('phone_number', data.phone_number)
      },
    })
  }

  const onSubmit = async (value: ScoreToMoneyFormType) => {
    try {
      let res
      if (!isEdit) {
        res = await request.post('score-to-money-form', {
          ...value,
          user_id: userStorage?.id,
          status: STATUS_FORM.AWAIT_CONFIRM,
          money: watch('points') * setting?.price_per_point,
        })
      } else {
        res = await request.patch(`score-to-money-form/${parseInt(params.id)}`, {
          ...value,
          user_id: userStorage?.id,
          status: STATUS_FORM.AWAIT_CONFIRM,
          money: watch('points') * setting?.price_per_point,
        })
      }

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

  const handleGoBack = () => {
    navigate(-1)
  }
  const TypographyByThemeStyleProps = ({ children }) => {
    return (
      <Typography sx={{ color: themeStyle === 'light' ? '#fff' : 'black' }}>{children}</Typography>
    )
  }

  const sxInputByThemeStyle =
    themeStyle === 'light'
      ? {
          '& fieldset': {
            borderColor: '#ffffff80 !important',
          },
        }
      : undefined
  console.log('theme style', themeStyle)
  return (
    <Grid container component="form" rowSpacing={1} onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={12} sx={{ mb: 4 }}>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)' } }}>
          <TypographyByThemeStyleProps>
            Tỉ lệ đổi: 1 điểm = {numberWithCommas(setting?.price_per_point)}đ
          </TypographyByThemeStyleProps>
          <Input
            sx={{ borderRadius: 6, ...sxInputByThemeStyle }}
            type="number"
            fullWidth
            name="points"
            control={control}
            required
            placeholder="Nhập số điểm muốn đổi"
            label="Số điểm muốn đổi"
          />
          <TypographyByThemeStyleProps>
            Số tiền bạn sẽ nhận được là:{' '}
            {numberWithCommas((watch('points') as number) * setting?.price_per_point)}đ{' '}
          </TypographyByThemeStyleProps>
        </Box>
      </Grid>

      <TypographyByThemeStyleProps>Thông tin ngân hàng nhận tiền</TypographyByThemeStyleProps>
      <Grid item xs={12} sx={{ mb: 4 }} container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ThemeProvider theme={darkTheme}>
            <Select
              sx={{
                // color: 'black !important',
                ...sxInputByThemeStyle,
                '& input': {
                  color: themeStyle === 'light' ? 'white' : 'unset',
                },
              }}
              placeholder="Chọn ngân hàng"
              options={bankOptions}
              name="bank_name"
              label="Ngân hàng"
              control={control}
              fullWidth
              required
            />
          </ThemeProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            type="number"
            fullWidth
            name="bank_number"
            control={control}
            required
            placeholder="Nhập số tài khoản"
            label="Số tài khoản"
            sx={{ ...sxInputByThemeStyle }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            name="bank_owner"
            control={control}
            required
            placeholder="Tên chủ thẻ"
            label="Tên chủ thẻ"
            sx={{ ...sxInputByThemeStyle }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            name="bank_branch"
            control={control}
            placeholder="Tên chi nhánh"
            label="Chi nhánh"
            sx={{ ...sxInputByThemeStyle }}
          />
        </Grid>
      </Grid>
      <TypographyByThemeStyleProps>Thông tin liên hệ</TypographyByThemeStyleProps>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            name="name"
            disabled
            control={control}
            required
            placeholder="Họ và tên"
            label="Họ và tên"
            sx={{ ...sxInputByThemeStyle }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            type="number"
            fullWidth
            name="phone_number"
            control={control}
            required
            placeholder="Số điện thoại"
            label="Số điện thoại"
            sx={{ ...sxInputByThemeStyle }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={isEdit ? handleGoBack : handleClose} variant="outlined">
            {isEdit ? t('action.goback') : t('cancel')}
          </Button>
          {isEdit ? (
            <Button color="primary" sx={{ ml: 1 }} type="submit" variant="contained">
              {t('action.update')}
            </Button>
          ) : (
            <Button color="primary" sx={{ ml: 1 }} type="submit" variant="contained">
              {t('submit')}
            </Button>
          )}
        </Box>
      </Grid>
    </Grid>
  )
}
