import { Box, Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'

import {
  cryptoApiHeaders,
  defaultReferenceCurrency,
  optionTimeFilter,
  optionTimeFilterGecko,
  RAPID_API_URL,
} from '@/constants'
import { CoinDataType, PriceChartDataResponseType, ServerResponseType } from '@/libs/types/apiChart'

import { ChartSkeleton } from '../Skeleton/ChartSkeleton'
import { TabPanel, TabsStyled, TabStyled } from '../Tabs'
import { dataChartType } from './component/BarLineChart'
import { CandleChart } from './component/CandleChart'
import { MarketChart, PriceChart } from './component/chartComponent'
import { parseDataChart, parseVolumeData } from './component/parseDataChart'

enum Tab {
  Price,
  MarketCap,
  CandleChart,
}
export type priceChartParseData = {
  dataX: string[]
  dataY: {
    price: number[]
    volume: number[]
  }
}

export const defaultPriceData = {
  dataX: [],
  dataY: {
    price: [],
    volume: [],
  },
}
export type ChartCoinProps = {
  idCoin: string
}

const ChartCoin: React.FC<ChartCoinProps> = ({ idCoin }) => {
  const { coin_id } = useParams()
  const [tab, setTab] = useState<Tab>(Tab.Price)
  const [priceData, setPriceData] = useState<dataChartType>(defaultPriceData)
  const [candleChartData, setCandleChartData] = useState<number[][]>([])
  const [timeOption, setTimeOption] = useState('7d')
  console.log('cryptoApiHeaders',cryptoApiHeaders)
  const { isSuccess: isCoinDataSuccess, refetch } = useQuery<ServerResponseType<CoinDataType>>(
    [
      `${RAPID_API_URL}/coin/${idCoin}`,
      { referenceCurrencyUuid: defaultReferenceCurrency, timePeriod: timeOption },
      {
        headers: cryptoApiHeaders,
      },
    ],
    {
      retry: 3,
      onSuccess: (data) => {
        const volumeDataResponse = data.data.coin.sparkline
        const volumeData = parseVolumeData(volumeDataResponse, priceData.dataY.price.length)
        const newPriceData = {
          ...priceData,
          dataY: { ...priceData?.dataY, volume: volumeData },
        }

        setPriceData(newPriceData)
      },
      enabled: !priceData.dataY.volume.length,
    },
  )
  const { isSuccess: isPriceResponseSuccess, refetch: priceRefetch } = useQuery<
    ServerResponseType<PriceChartDataResponseType>
  >(
    [
      `${RAPID_API_URL}/coin/${idCoin}/history`,
      { referenceCurrencyUuid: defaultReferenceCurrency, timePeriod: timeOption },
      {
        headers: cryptoApiHeaders,
      },
    ],
    {
      retry: 3,
      onSuccess: (data) => {
        const dataParse = parseDataChart(data.data.history)
        setPriceData(dataParse)
        refetch()
      },
      enabled: !priceData.dataX.length && !priceData.dataY.price.length,
    },
  )

  const { refetch: tempfetch } = useQuery(
    [
      `https://api.coingecko.com/api/v3/coins/${coin_id}/ohlc?vs_currency=usd&days=${
        optionTimeFilterGecko[timeOption as keyof typeof optionTimeFilterGecko]
      }`,
    ],
    {
      retry: 3,
      onSuccess: (data) => {
        setCandleChartData(data as number[][])
      },
      enabled: !candleChartData.length,
    },
  )

  useEffect(() => {
    refetch()
    priceRefetch()
    tempfetch()
  }, [timeOption])

  return priceData.dataX.length &&
    priceData.dataY.price.length &&
    priceData.dataY.volume.length &&
    candleChartData.length ? (
    <Box>
      <Box
        sx={{
          flexDirection: { xs: 'column', md: 'row' },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ maxWidth: '100%' }}>
          <TabsStyled
            sx={{ width: '100%' }}
            value={tab}
            numberOfTab={3}
            onChange={(e, value) => setTab(value)}
            allowScrollButtonsMobile
          >
            <TabStyled label="Price" />
            <TabStyled label="Market Cap" />
            <TabStyled label="Candle Chart" />
          </TabsStyled>
        </Box>

        <Stack
          direction="row"
          justifyContent="flex-start"
          sx={{ mt: 2, width: { xs: '100%', sm: '70%', md: '40%', lg: '30%' } }}
        >
          {optionTimeFilter.map((option) => (
            <Box sx={{ width: `${100 / 6}%` }} key={option}>
              <Button
                sx={{
                  bgcolor: option === timeOption ? 'white' : '#0C1023',
                  paddingX: { xs: '0px !important', sm: 'unset' },
                  width: `100%`,
                  '&.MuiButton-root': {
                    minWidth: '48px !important',
                  },
                }}
                onClick={() => setTimeOption(option)}
              >
                {option}
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
      <TabPanel value={tab} index={Tab.Price}>
        <PriceChart data={priceData} />
      </TabPanel>
      <TabPanel value={tab} index={Tab.MarketCap}>
        <MarketChart data={priceData} />
      </TabPanel>
      <TabPanel value={tab} index={Tab.CandleChart}>
        <CandleChart dataCandle={candleChartData} />
      </TabPanel>
    </Box>
  ) : (
    <ChartSkeleton />
  )
}

export { ChartCoin }
