import { Box, Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'

import { Card } from '@/components'
import { CustomLink, WhiteTypograpy } from '@/styles'

export const SiteMap = () => {
  const { data, isLoading } = useQuery(['coin/all'])
  const { t } = useTranslation()
  return (
    <Card title={t('list_currencies.title')} hasMore={false}>
      {isLoading ? (
        <Box>Loading ...</Box>
      ) : (
        <>
          <WhiteTypograpy>SiteMap</WhiteTypograpy>
          <Grid container rowSpacing={1}>
            {/* @ts-ignore */}
            {data?.map((item, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <CustomLink
                  sx={{
                    color: '#6188ff',
                    '&:hover': {
                      color: '#98caff',
                    },
                  }}
                  to={`/currencies/${item.id}`}
                >
                  {item.name}
                </CustomLink>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Card>
  )
}
