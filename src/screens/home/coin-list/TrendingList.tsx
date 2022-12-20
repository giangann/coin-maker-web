import { Box, Stack, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { Card } from '@/components'
import { roundNumberLastZero } from '@/libs/utils'
import { CustomLink, green, imageStyle, WhiteTypograpy } from '@/styles'
interface ICoinListProps {
  item: {
    id: string
    coin_id: number
    name: string
    symbol: string
    thumb: string
    price_btc: string | number
  }
}

interface ICoinListResponse {
  coins: ICoinListProps[]
}

export const TrendingList = ({ variant }: { variant?: 'first' | 'last' }) => {
  const { t } = useTranslation()
  const [trendingList, setTrendingList] = useState<ICoinListProps[]>([])

  useQuery<ICoinListResponse>([`https://api.coingecko.com/api/v3/search/trending`], {
    onSuccess: (data) => {
      // console.log(data)
      if (variant === 'last') {
        setTrendingList(data.coins.slice(3, 6))
      } else {
        setTrendingList(data.coins.slice(0, 3))
      }
    },
    onError: (error: any) => {
      toast.error(error.message)
    },
    retry: 3,
  })

  return (
    <Card title={variant === 'last' ? t('many_search') : t('trending')} hasMore={false}>
      <Stack spacing={2}>
        {trendingList.map((item: ICoinListProps, index) => (
          <Stack key={item.item.coin_id} direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <WhiteTypograpy sx={{ opacity: 0.5 }}>{index + 1}</WhiteTypograpy>
              <Box sx={{ ...imageStyle }} component="img" src={item.item.thumb} />
              <Stack
                direction={{
                  xs: 'column',
                  sm: 'row',
                }}
                spacing={{
                  sm: 1,
                  xs: 0,
                }}
                alignItems={{
                  xs: 'flex-start',
                  sm: 'center',
                }}
              >
                <CustomLink to={`/currencies/${item.item.id}`}>
                  <WhiteTypograpy>{item.item.name}</WhiteTypograpy>
                </CustomLink>

                <WhiteTypograpy
                  sx={{
                    opacity: 0.5,
                    fontSize: {
                      xs: '0.75rem',
                      sm: '0.775rem',
                    },
                    fontWeight: 'bold',
                  }}
                >
                  {item.item.symbol}
                </WhiteTypograpy>
              </Stack>
            </Stack>
            <Typography color={green['primary']}>
              {roundNumberLastZero(item.item.price_btc)} (BTC)
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
  )
}
