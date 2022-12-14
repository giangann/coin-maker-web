// @ts-nocheck

import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Grid, Typography } from '@mui/material'
import { styled, ThemeProvider } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'

import { STATUS_FORM } from '@/constants'
import { useAuth } from '@/libs/hooks'
import i18n from '@/libs/lang/translations/i18n'
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
  status: number
}

export type ScoreToMoneyFormProps = {
  handleClose?: any
  themeStyle?: 'light' | 'dark'
}

const validateForm = yup.object({
  points: yup.number().required(i18n.t('validate.required')),
  bank_name: yup.string().trim().required(i18n.t('validate.required')),
  bank_number: yup.string().trim().required(i18n.t('validate.required')),
  bank_owner: yup.string().trim().required(i18n.t('validate.required')),
  // name: yup.string().trim().required(i18n.t('validate.required')),
  phone_number: yup.string().trim().required(i18n.t('validate.required')),
})

export const ScoreToMoneyForm = (props: ScoreToMoneyFormProps & any) => {
  const { handleClose, themeStyle } = props
  const { userStorage } = useAuth()
  const { data: listBanksData } = useQuery([`https://api.vietqr.io/v2/banks`])
  const { data: scoreData } = useQuery<any>('user/calculate-score')
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
      status: STATUS_FORM.AWAIT_CONFIRM,
    },

    resolver: yupResolver(validateForm),
  })

  // check is user_edit/user_create/admin_view
  const isEdit = params.id ? true : false
  const { isAdmin } = useAuth()
  const isDisable = (isAdmin && isEdit) || watch('status') !== STATUS_FORM.AWAIT_CONFIRM
  // console.log('id of form', params.id)

  if (isEdit) {
    useQuery(`score-to-money-form/${params.id}`, {
      onSuccess: (data: any) => {
        // console.log('value', data)
        setValue('points', data.points)
        setValue('bank_name', data.bank_name)
        setValue('bank_number', data.bank_number)
        setValue('bank_owner', data.bank_owner)
        setValue('bank_branch', data.bank_branch)
        setValue('name', data.name)
        setValue('phone_number', data.phone_number)
        setValue('status', data.status)
      },
    })
  }

  const onSubmit = async (value: ScoreToMoneyFormType) => {
    console.log('submit')
    try {
      // check points of requets:
      if (value['points'] > scoreData.avaiable_score) {
        toast.error(t('validate.run_out_of_points'))
        return
      }

      console.log('is edit', isEdit)
      // if points is enough
      let res
      if (!isEdit) {
        res = await request.post('score-to-money-form', {
          ...value,
          user_id: userStorage?.id,
          money: watch('points') * setting?.price_per_point,
        })
      } else {
        res = await request.patch(`score-to-money-form/${parseInt(params.id)}`, {
          ...value,
          user_id: userStorage?.id,
          money: watch('points') * setting?.price_per_point,
        })
      }

      if (res.status === 200) {
        toast.success(res.data.message)
        if (isEdit) {
          if (isAdmin) navigate('/dashboard')
          else navigate('/profile')
        } else {
          queryClient.fetchQuery(`score-to-money-form`, { staleTime: 2000 })
          queryClient.fetchQuery(`user/calculate-score`, { staleTime: 2000 })
          handleClose()
        }
      }
    } catch (error) {
      toast.error(error.errors)
    }
  }

  const handleApprove = async (action: string) => {
    const value: ScoreToMoneyFormType = getValues()

    let newStatus
    if (action === 'rejected') {
      newStatus = STATUS_FORM.REJECTED
    }
    if (action === 'accepted') {
      newStatus = STATUS_FORM.ACCEPTED
    }
    try {
      const res = await request.patch(`score-to-money-form/${parseInt(params.id)}`, {
        ...value,
        status: newStatus,
      })

      if (res.status === 200) {
        toast.success(res.data.message)
        handleGoBack()
      }
    } catch (error: any) {
      console.log('error', error)
      toast.error(error.errors)
    }
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
  return (
    <Grid container component="form" rowSpacing={1}>
      <Grid item xs={12} sx={{ mb: 4 }}>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 16px)' } }}>
          <TypographyByThemeStyleProps>
            {t('form.conversion_rate')}
            {numberWithCommas(setting?.price_per_point)}đ
          </TypographyByThemeStyleProps>
          <Input
            sx={{ borderRadius: 6, ...sxInputByThemeStyle }}
            type="number"
            fullWidth
            name="points"
            control={control}
            required
            placeholder={t('form.type_conversion_points')}
            label={t('form.conversion_points')}
            disabled={isDisable}
          />
          <TypographyByThemeStyleProps>
            {t('form.money_you_will_take')}
            {numberWithCommas((watch('points') as number) * setting?.price_per_point)}đ{' '}
          </TypographyByThemeStyleProps>
        </Box>
      </Grid>

      <TypographyByThemeStyleProps>{t('form.bank_information')}</TypographyByThemeStyleProps>
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
              placeholder={t('form.select_bank')}
              options={bankOptions}
              name="bank_name"
              label={t('form.bank_name')}
              control={control}
              fullWidth
              required
              disabled={isDisable}
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
            placeholder={t('form.type_bank_number')}
            label={t('form.bank_number')}
            sx={{ ...sxInputByThemeStyle }}
            disabled={isDisable}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            name="bank_owner"
            control={control}
            required
            placeholder={t('form.type_bank_owner')}
            label={t('form.bank_owner')}
            sx={{ ...sxInputByThemeStyle }}
            disabled={isDisable}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            name="bank_branch"
            control={control}
            placeholder={t('form.type_bank_branch')}
            label={t('form.bank_branch')}
            sx={{ ...sxInputByThemeStyle }}
            disabled={isDisable}
          />
        </Grid>
      </Grid>
      <TypographyByThemeStyleProps>{t('form.contact_information')}</TypographyByThemeStyleProps>
      <Grid item xs={12} container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Input
            fullWidth
            name="name"
            disabled
            control={control}
            required
            placeholder={t('form.type_user_name')}
            label={t('form.user_name')}
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
            placeholder={t('form.type_phone_number')}
            label={t('form.phone_number')}
            sx={{ ...sxInputByThemeStyle }}
            disabled={isDisable}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        {isDisable && isAdmin ? (
          <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleGoBack} variant="outlined">
              {t('action.goback')}
            </Button>
            <ButtonCustomDisableColor
              color="error"
              sx={{ ml: 1 }}
              onClick={() => handleApprove('rejected')}
              variant="contained"
              disabled={watch('status') !== STATUS_FORM.AWAIT_CONFIRM}
            >
              {t('action.reject')}
            </ButtonCustomDisableColor>
            <ButtonCustomDisableColor
              color="primary"
              sx={{ ml: 1 }}
              onClick={() => handleApprove('accepted')}
              variant="contained"
              disabled={watch('status') !== STATUS_FORM.AWAIT_CONFIRM}
            >
              {t('action.accept')}
            </ButtonCustomDisableColor>
          </Box>
        ) : (
          <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={isEdit ? handleGoBack : handleClose} variant="outlined">
              {isEdit ? t('action.goback') : t('cancel')}
            </Button>
            {isEdit ? (
              <ButtonCustomDisableColor
                color="primary"
                sx={{ ml: 1 }}
                onClick={handleSubmit(onSubmit)}
                variant="contained"
                disabled={watch('status') !== STATUS_FORM.AWAIT_CONFIRM}
              >
                {t('action.update')}
              </ButtonCustomDisableColor>
            ) : (
              <Button
                color="primary"
                sx={{ ml: 1 }}
                onClick={handleSubmit(onSubmit)}
                variant="contained"
              >
                {t('submit')}
              </Button>
            )}
          </Box>
        )}
      </Grid>
    </Grid>
  )
}

const ButtonCustomDisableColor = styled(Button)({
  '&.Mui-disabled': {
    backgroundColor: '#ffffff',
    color: '#00000080 !important',
  },
})
