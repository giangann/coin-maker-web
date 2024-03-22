import { Typography } from '@mui/material'
import { Box, Stack } from '@mui/system'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { TableSkeleton } from '@/components'
import { defaultPriceData } from '@/components/Charts/ChartCoin'
import { dataChartType } from '@/components/Charts/component/BarLineChart'
import { LineChart } from '@/components/Charts/component/chartComponent'
import { parseDataChart } from '@/components/Charts/component/parseDataChart'
import { RAPID_API_URL, cryptoApiHeaders, defaultReferenceCurrency } from '@/constants'
import { ICoin, ICoinLaravel } from '@/libs/types'
import { PriceChartDataResponseType, ServerResponseType } from '@/libs/types/apiChart'
import { backgroundColor, blue, CustomLink } from '@/styles'
export type CoinGraphType = {
  coin: ICoin
  colorGraph: string
  colorLine: string
}

const CoinGraph: React.FC<CoinGraphType> = ({ coin, colorGraph, colorLine }) => {
  const { t } = useTranslation()
  const [priceData, setPriceData] = useState<dataChartType>(defaultPriceData)
  const [uuidCoin, setUuidCoin] = useState<string>('Qwsogvtv82FCd')

  useQuery<ICoinLaravel>([`coin/${coin.id}`], {
    onSuccess(data) {
      setUuidCoin(data.uuid)
    },
  })

  const { isFetching: isPriceResponseLoading, refetch } = useQuery<
    ServerResponseType<PriceChartDataResponseType>
  >(
    [
      `${RAPID_API_URL}/coin/${uuidCoin}/history`,
      { referenceCurrencyUuid: defaultReferenceCurrency, timePeriod: '30d' },
      {
        headers: cryptoApiHeaders,
      },
    ],
    {
      onSuccess: (data) => {
        const dataParse = parseDataChart(data.data.history)
        setPriceData(dataParse)
      },
      enabled: uuidCoin !== '',
    },
  )

  return !isPriceResponseLoading && coin ? (
    <Stack height={280} border="1px solid white" borderRadius={1}>
      <Stack
        direction="row"
        justifyContent="space-between"
        px={2}
        py={3.5}
        sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
        bgcolor={backgroundColor['primary']}
      >
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
          <Box
            component="img"
            sx={{
              height: 48,
              width: 48,
            }}
            alt="logo coin"
            src={coin?.image as unknown as string}
          />
          <Stack>
            <Typography color="white">{coin?.name}</Typography>
            <Typography color="white">
              {`${coin?.symbol} (USD) = ${Number(coin?.current_price).toFixed(
                3,
              )} (${coin?.price_change_percentage_24h.toFixed(3)}%)`}
            </Typography>
          </Stack>
        </Stack>
        <CustomLink to={`/currencies/${coin.id}`}>
          <Typography color={blue['primary']}>{t('more')}</Typography>
        </CustomLink>
      </Stack>
      <Box overflow="hidden" sx={{ bgcolor: colorGraph }}>
        <LineChart data={priceData} colorLine={colorLine} />
      </Box>
    </Stack>
  ) : (
    <TableSkeleton col_number={4} row_number={5} />
  )
}

export { CoinGraph }
