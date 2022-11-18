import { Box, Button, Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

import { baseUrl, cryptoApiHeaders, defaultReferenceCurrency, optionTimeFilter } from '@/constants'
import { CoinDataType, PriceChartDataResponseType, ServerResponseType } from '@/libs/types/apiChart'

import { ChartSkeleton } from '../Skeleton/ChartSkeleton'
import { TabPanel, TabsStyled, TabStyled } from '../Tabs'
import { BarLineChart, dataChartType } from './component/BarLineChart'
import { CandleChart } from './component/CandleChart'
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
  const [tab, setTab] = useState<Tab>(Tab.Price)
  const [priceData, setPriceData] = useState<dataChartType>(defaultPriceData)
  const [timeOption, setTimeOption] = useState('7d')
  const { isSuccess: isCoinDataSuccess, refetch } = useQuery<ServerResponseType<CoinDataType>>(
    [
      `${baseUrl}/coin/${idCoin}`,
      { referenceCurrencyUuid: defaultReferenceCurrency, timePeriod: timeOption },
      {
        headers: cryptoApiHeaders,
      },
    ],
    {
      onSuccess: (data) => {
        const volumeDataResponse = data.data.coin.sparkline
        const volumeData = parseVolumeData(volumeDataResponse, priceData.dataY.price.length)
        const newPriceData = {
          ...priceData,
          dataY: { ...priceData?.dataY, volume: volumeData },
        }

        setPriceData(newPriceData)
      },
    },
  )
  const { isSuccess: isPriceResponseSuccess, refetch: priceRefetch } = useQuery<
    ServerResponseType<PriceChartDataResponseType>
  >(
    [
      `${baseUrl}/coin/${idCoin}/history`,
      { referenceCurrencyUuid: defaultReferenceCurrency, timePeriod: timeOption },
      {
        headers: cryptoApiHeaders,
      },
    ],
    {
      onSuccess: (data) => {
        const dataParse = parseDataChart(data.data.history)
        setPriceData(dataParse)
        refetch()
      },
    },
  )

  useEffect(() => {
    refetch()
    priceRefetch()
  }, [timeOption])

  return isPriceResponseSuccess && isCoinDataSuccess ? (
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
        <BarLineChart height={600} data={priceData} isPriceOption />
      </TabPanel>
      <TabPanel value={tab} index={Tab.MarketCap}>
        <BarLineChart height={600} data={priceData} isMarketOption />
      </TabPanel>
      <TabPanel value={tab} index={Tab.CandleChart}>
        <CandleChart />
      </TabPanel>
    </Box>
  ) : (
    <ChartSkeleton />
  )
}

export { ChartCoin }
