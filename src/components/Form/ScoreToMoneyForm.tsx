import { Box, Grid, Typography } from '@mui/material'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'

import { useAuth } from '@/libs/hooks'

import { Select } from '../AutoComplete'
import { Input } from '../Input'

export type ScoreToMoneyFormType = {
  points: number | string
  bank_name: string
  bank_number: string | number
  bank_owner?: string
  bank_branch?: string
  name: string
  phone_number: string | number
}

export const ScoreToMoneyForm = () => {
  const { userStorage } = useAuth()
  // const [bankOptions, setBankOptions] = useState<SelectOption[]>()
  const { data: listBanksData } = useQuery([`https://api.vietqr.io/v2/banks`])

  console.log(listBanksData)
  const bankOptions = listBanksData?.data?.map((item, index) => {
    return {
      value: item.id,
      label: item.short_name,
    }
  })
  console.log('bankOptions', bankOptions)
  console.log('listBanksData', listBanksData)
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
  return (
    <Grid container component="form" rowSpacing={1}>
      <Grid item xs={12} sx={{ mb: 4 }}>
        <Box sx={{ width: { xs: '100%', sm: '50%' } }}>
          <Typography sx={{ color: 'black' }}>Tỉ lệ đổi: 1 điểm = 10.000đ</Typography>
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
            Số tiền bạn sẽ nhận được là: {(watch('points') as number) * 10}.000đ{' '}
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
    </Grid>
  )
}
