import { Box, Stack, styled, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AiFillInfoCircle } from 'react-icons/ai'
import { BiChevronDown, BiLinkExternal } from 'react-icons/bi'

import { Card, Chip, ChipDropDown, ChipLink } from '@/components'
import { LineCodeIcon, LinkIcon, PublicIcon, SearchIcon } from '@/components/Icons'
import { ICoin } from '@/libs/types'
import {
  convertCurrency,
  filterEmptySrting,
  numberWithCommas,
  removeDash,
  removeHttpAndSlash,
} from '@/libs/utils'
import { BoxFlexStart, CustomLinkMUI, grey, MenuItemStyled } from '@/styles'

interface ICardCoinRight {
  coin: ICoin | null
}

export const CardCoinRight: React.FC<ICardCoinRight> = ({ coin }) => {
  const { t } = useTranslation()
  const [platformsEntries, setPlatformsEntries] = React.useState<[string, string][]>([])
  useEffect(() => {
    setPlatformsEntries(Object.entries(coin?.platforms || {}))
  }, [coin])

  // console.log(platformsEntries)

  return (
    <Card hasMore={false} sx={{ height: '100%' }}>
      <Stack direction="row" gap="12px" sx={{ overflowY: 'auto' }}>
        <ChipLink
          content={coin?.links.homepage[0] || ''}
          startIcon={<LinkIcon />}
          link={coin?.links.homepage[0] || ''}
          hasHover={true}
          endIcon={<BiLinkExternal />}
          sx={{ whiteSpace: 'nowrap' }}
        />
        <ChipDropDown
          content={t('explore')}
          startIcon={<SearchIcon />}
          endIcon={<BiChevronDown />}
          data={filterEmptySrting(coin?.links?.blockchain_site || [])}
          customMenu={(item: string, index: number) => (
            <MenuItemStyled key={index}>
              <CustomLinkMUI href={item} target="_blank">
                {removeHttpAndSlash(item)}
                <BiLinkExternal style={{ marginLeft: '4px' }} />
              </CustomLinkMUI>
            </MenuItemStyled>
          )}
          sx={{ whiteSpace: 'nowrap' }}
        />
        <ChipDropDown
          content={t('comunity') + ' fix cung'}
          startIcon={<PublicIcon />}
          endIcon={<BiChevronDown />}
          data={filterEmptySrting(coin?.links?.blockchain_site || [])}
          customMenu={(item: string, index: number) => (
            <MenuItemStyled key={index}>
              <CustomLinkMUI href={item} target="_blank">
                {removeHttpAndSlash(item)}
                <BiLinkExternal style={{ marginLeft: '4px' }} />
              </CustomLinkMUI>
            </MenuItemStyled>
          )}
          sx={{ whiteSpace: 'nowrap' }}
        />
        {coin?.links?.repos_url?.github[0] && (
          <ChipLink
            content={t('source_code')}
            startIcon={<LineCodeIcon />}
            endIcon={<BiLinkExternal />}
            hasHover={true}
            link={coin?.links?.repos_url?.github[0]}
            sx={{ whiteSpace: 'nowrap' }}
          />
        )}
      </Stack>

      {platformsEntries.length && platformsEntries[0][1] && (
        <Box sx={{ marginTop: '16px' }}>
          <TextTitle>{t('contracts')}</TextTitle>
          <Stack direction="row" gap="8px" mt="8px" sx={{ overflowY: 'auto' }}>
            <Chip
              content={`${removeDash(platformsEntries[0][0])}: ${platformsEntries[0][1]}`}
              startIcon={<img src={coin?.image?.thumb} alt="" width="12px" height="12px" />}
              sx={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
            />

            <ChipDropDown
              content={t('more')}
              endIcon={<BiChevronDown />}
              data={platformsEntries}
              customMenu={(platform: [string, string], index: number) => (
                <MenuItemStyled key={index}>
                  <CustomLinkMUI href={''} target="_blank">
                    <Stack>
                      <TextTitle sx={{ textTransform: 'capitalize' }}>
                        {removeDash(platform[0])}
                      </TextTitle>
                      <TextTitle>{platform[1]}</TextTitle>
                    </Stack>
                  </CustomLinkMUI>
                </MenuItemStyled>
              )}
              sx={{ whiteSpace: 'nowrap' }}
            />
          </Stack>
        </Box>
      )}

      <Box sx={{ marginTop: '16px' }}>
        <TextTitle>{t('audits')}</TextTitle>
        <Stack direction="row" gap="8px" mt="8px">
          <Chip content={`Metaverse fix cng`} />
        </Stack>
      </Box>

      <BoxFlexStart
        sx={{ marginTop: '16px', padding: '12px', border: `1px solid ${grey['secondary']}` }}
      >
        <Box sx={{ flex: 1, borderRight: `1px solid ${grey['secondary']}` }}>
          <Stack
            gap="4px"
            sx={{
              borderBottom: `1px solid ${grey['secondary']}`,
              paddingBottom: '8px',
              marginBottom: '8px',
            }}
          >
            <TextTitle>
              {t('market_cap')} <AiFillInfoCircle style={{ position: 'relative', top: '2px' }} />
            </TextTitle>
            <TextPrice>{convertCurrency(coin?.market_data?.market_cap?.usd || 0)}</TextPrice>
          </Stack>
          <Stack gap="4px">
            <TextTitle>
              {t('volume')} <AiFillInfoCircle style={{ position: 'relative', top: '2px' }} />
            </TextTitle>
            <TextPrice>{convertCurrency(coin?.market_data?.total_volume?.usd || 0)}</TextPrice>
          </Stack>
        </Box>
        <Box sx={{ flex: 1, marginLeft: '16px' }}>
          <TextTitle>
            {t('circulating_supply')}{' '}
            <AiFillInfoCircle style={{ position: 'relative', top: '2px' }} />
          </TextTitle>
          <TextPrice>
            {numberWithCommas(coin?.market_data?.circulating_supply || 0)}{' '}
            <span style={{ textTransform: 'uppercase' }}>{coin?.symbol}</span>
          </TextPrice>
        </Box>
      </BoxFlexStart>
    </Card>
  )
}

const TextTitle = styled(Typography)({
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '12px',
})

const TextPrice = styled(Typography)({
  fontWeight: 700,
  fontSize: '14px',
})
