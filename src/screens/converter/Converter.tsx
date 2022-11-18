import { Autocomplete, Box, Grid, TextField } from '@mui/material'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Card, StyledInputBase } from '@/components'
import { DEFAULT_CONVERT_UNIT } from '@/constants'
import { exchangeRatesAtom } from '@/libs/atoms'
import { backgroundColor, WhiteTypograpy } from '@/styles'

export const Converter = () => {
  const [exchangeRates] = useAtom(exchangeRatesAtom)
  const { t } = useTranslation()
  const defaultOrigin = exchangeRates?.[DEFAULT_CONVERT_UNIT.ORIGIN]
  const defaultDest = exchangeRates?.[DEFAULT_CONVERT_UNIT.DEST]

  const [origin, setOrigin] = useState({
    inputValue: 1,
    currency: defaultOrigin,
  })
  const [dest, setDest] = useState({
    outputValue: (origin?.inputValue * defaultDest.value) / origin?.currency?.value,
    currency: defaultDest,
  })

  const listCurrency = Object.entries(exchangeRates).map((item) => ({
    label: item[0],
    value: {
      name: item[1].name,
      value: item[1].value,
      unit: item[1].unit,
      type: item[1].type,
    },
  }))

  const handleChangeOriginPrice = (value: number) => {
    setOrigin({ ...origin, inputValue: value })
    setDest({ ...dest, outputValue: (value * dest.currency.value) / origin?.currency.value })
  }
  return (
    <Card title={t('product.converter_title')} hasMore={false}>
      <Box sx={{ p: 2, py: { sm: 4 }, backgroundColor: backgroundColor['main'], borderRadius: 1 }}>
        <StyledInputBase
          type="number"
          value={origin.inputValue}
          onChange={(e) => handleChangeOriginPrice(parseInt(e.target.value))}
          sx={{
            width: { xs: '100%', sm: 'calc(50% - 8px)' },
            '& input': {
              paddingLeft: '10px !important',
            },
            borderRadius: 1,
          }}
          backgroundColor={backgroundColor['chip']}
          placeholder={t('product.type_number')}
        />
        <br></br>
        <Grid mt={{ sm: 0.5 }} sx={{ pt: '8px !important' }} container spacing={2}>
          <Grid item xs={12} sm={6} sx={{ paddingTop: { sm: '0px !important' } }}>
            <Autocomplete
              componentsProps={{
                paper: { sx: { backgroundColor: backgroundColor['autoCompleteInput'] } },
              }}
              disablePortal
              id="combo-box-demo"
              options={listCurrency}
              groupBy={(option) => option.value.type}
              getOptionLabel={(option) => option.value.name}
              defaultValue={listCurrency[0]}
              onChange={(event: any, newValue: any) => {
                setOrigin({
                  ...origin,
                  currency: newValue.value,
                })
                setDest({
                  ...dest,
                  outputValue: (origin.inputValue * dest.currency.value) / newValue.value.value,
                })
              }}
              sx={{
                width: '100%',
                '& .MuiTextField-root': {
                  backgroundColor: backgroundColor['autoCompleteInput'],
                  borderRadius: 1,
                  marginTop: 2,
                },
                '& .MuiSvgIcon-root': {
                  color: 'white !important',
                },
                '& input': {
                  padding: '0px !important',
                  color: 'white !important',
                },
                '& label': {
                  top: '-6px !important',
                },
              }}
              renderInput={(params) => (
                <TextField sx={{}} {...params} label={t('product.currency_type')} />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ paddingTop: { sm: '0px !important' } }}>
            <Autocomplete
              componentsProps={{
                paper: { sx: { backgroundColor: backgroundColor['autoCompleteInput'] } },
              }}
              disablePortal
              id="combo-box-demo"
              options={listCurrency}
              groupBy={(option) => option.value.type}
              getOptionLabel={(option) => option.value.name}
              defaultValue={
                listCurrency.filter((item) => item.label === DEFAULT_CONVERT_UNIT.DEST)[0]
              }
              onChange={(event: any, newValue: any) =>
                setDest({
                  ...dest,
                  outputValue: (origin.inputValue * newValue.value.value) / origin.currency.value,
                  currency: newValue.value,
                })
              }
              sx={{
                PaperProps: {
                  backgroundColor: 'red !important',
                },
                width: '100%',
                '& .MuiTextField-root': {
                  backgroundColor: backgroundColor['autoCompleteInput'],
                  borderRadius: 1,
                  marginTop: 2,
                },
                '& .MuiSvgIcon-root': {
                  color: 'white !important',
                },
                '& input': {
                  padding: '0px !important',
                  color: 'white !important',
                },
                '& label': {
                  top: '-6px !important',
                },
              }}
              renderInput={(params) => (
                <TextField sx={{}} {...params} label={t('product.currency_type')} />
              )}
            />
          </Grid>
          {origin.inputValue ? (
            <Grid item xs={12}>
              <WhiteTypograpy sx={{ textAlign: 'center', opacity: 0.7, fontWeight: 200 }}>
                <span style={{ fontWeight: 900, letterSpacing: 1, fontSize: 18 }}>
                  {origin.inputValue}{' '}
                </span>
                {origin.currency?.name} ({origin.currency?.unit}) ={' '}
                <span style={{ fontWeight: 900, letterSpacing: 1, fontSize: 18 }}>
                  {dest.outputValue}{' '}
                </span>{' '}
                {dest.currency?.name} ({dest.currency?.unit})
              </WhiteTypograpy>
            </Grid>
          ) : undefined}
        </Grid>
      </Box>
    </Card>
  )
}
