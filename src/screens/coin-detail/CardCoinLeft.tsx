// @ts-nocheck
import { Box, Tooltip } from '@mui/material'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { ArrowDropDownIcon, ArrowDropUpIcon, Card, Chip, StarFill, StarOutline } from '@/components'
import { useAuth } from '@/libs/hooks'
import { queryClient } from '@/libs/react-query'
import { request } from '@/libs/request'
import { ICoin } from '@/libs/types'
import { filterEmptySrting, numberWithCommas } from '@/libs/utils'
import { backgroundColor, BoxFlexAlignCenter, BoxFlexCenter, BoxHeader, green, red } from '@/styles'

import { TextPrice, Title } from './Coin'

interface ICardCoinLeft {
  coin: ICoin | null
  isCoinInWatchList?: boolean | undefined
  handleToogleWatchList?: (value: boolean) => void
}

export const CardCoinLeft: React.FC<ICardCoinLeft> = ({ coin, isCoinInWatchList }) => {
  const { t } = useTranslation()
  const { userStorage } = useAuth()
  const coinId = coin?.id
  const userId = userStorage?.id
  const addToWatchList = async () => {
    try {
      const res = await request.post('/watch-list', {
        user_id: userId,
        coin_id: coinId,
      })
      if (res.status === 200) {
        toast.success('Add to Watch List')
        queryClient.fetchQuery(
          [
            `coin/${coinId}`,
            {
              user_id: userId,
            },
          ],
          { staleTime: 2000 },
        )
      }
    } catch (error: any) {
      toast.error(error)
    }
  }

  const removeToWatchList = async () => {
    try {
      const res = await request.delete(`/watch-list/${coinId}/${userId}`)
      if (res.status === 200) {
        toast.success(res.data.message)
        queryClient.fetchQuery(
          [
            `coin/${coinId}`,
            {
              user_id: userId,
            },
          ],
          { staleTime: 2000 },
        )
      }
    } catch (error: any) {
      toast.error(error)
    }
  }

  const TitleCard = useMemo(
    () => (
      <>
        <BoxFlexAlignCenter>
          <img src={coin?.image?.thumb} alt="" />
          <BoxHeader sx={{ ml: '16px', mr: '36px' }}>{coin?.name}</BoxHeader>
          <Chip
            content={coin?.symbol as string}
            sx={{ marginRight: '24px', textTransform: 'uppercase' }}
          />

          {isCoinInWatchList ? (
            <Tooltip followCursor title="Remove from Watch List" arrow placement="bottom-end">
              <Chip
                hasHover
                handleClick={removeToWatchList}
                content={<StarFill />}
                isOutline={true}
                sx={{ backgroundColor: backgroundColor['chipOfWatchList'] }}
              />
            </Tooltip>
          ) : (
            <Tooltip followCursor title="Add to Watch List" arrow placement="bottom-end">
              <Chip
                hasHover
                handleClick={addToWatchList}
                content={<StarOutline />}
                isOutline={true}
              />
            </Tooltip>
          )}
        </BoxFlexAlignCenter>
        <BoxFlexAlignCenter gap="16px" sx={{ mt: '16px' }}>
          <Chip content={`${t('rank')} ${coin?.market_cap_rank}`} />
          <Chip content={'Đồng coin'} />
          <Chip content={'On 3,516,026 watchlists'} />
        </BoxFlexAlignCenter>
      </>
    ),
    [coin, isCoinInWatchList],
  )

  return (
    <div>
      <Card title={TitleCard} hasMore={false}>
        <Box>
          <Title>
            {t('price')} {coin?.name} (USD)
          </Title>
          <BoxFlexAlignCenter>
            <TextPrice>${numberWithCommas(coin?.market_data?.current_price?.usd || 0)}</TextPrice>
            <Chip
              content={
                <BoxFlexCenter>
                  {coin?.market_data.price_change_percentage_24h}%{/* @ts-ignore */}
                  {coin?.market_data?.price_change_percentage_24h < 0 ? (
                    <ArrowDropDownIcon height="20px" width="20px" />
                  ) : (
                    <ArrowDropUpIcon height="20px" width="20px" />
                  )}
                </BoxFlexCenter>
              }
              sx={{
                backgroundColor:
                  coin?.market_data?.price_change_percentage_24h > 0
                    ? green['primary']
                    : red['primary'],
                marginLeft: '24px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            />
          </BoxFlexAlignCenter>
          <Title>0.06714 BTC fix cung</Title>
        </Box>
        {coin?.categories && (
          <Box mt={1}>
            <Title>{t('tag')}</Title>
            <Box>
              {filterEmptySrting(coin?.categories).map((item, index) => (
                <Chip content={item} key={index} sx={{ marginRight: '8px', marginTop: '8px' }} />
              ))}
            </Box>
          </Box>
        )}
      </Card>
    </div>
  )
}
