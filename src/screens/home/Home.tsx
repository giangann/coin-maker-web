import { Grid } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Column } from 'react-table'

import { TextChangePercent } from '@/components'
import { ReactTableWithToolBar } from '@/components/ReactTable'
import { convertCurrency, numberWithCommas, removeDecimal } from '@/libs/utils'
import { TrendingList } from '@/screens/home'
import { colorCoinGraph, CustomLink, strokeColor } from '@/styles'

import { CoinGraph } from './coinGraph/CoinGraph'

// import viberateLogo from '@/viberate_logo.png'

export type ColType = {
  id: string
  market_cap_rank: number
  name: string
  current_price: string
  price_change_percentage_1h_in_currency: string
  price_change_percentage_24h_in_currency: string
  price_change_percentage_7d_in_currency: string
  market_cap: string
  circulating_supply: string
  symbol: string
}

const endpoint =
  'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d'

export const Home = () => {
  const { t } = useTranslation()
  const [params, setParams] = React.useState({})
  // const { paginationData, handleChangeParams, refetch } = usePaginationQuery<any>(endpoint, params)
  const [listCoinGraph, setListCoinGraph] = React.useState<any[]>([])

  const { isLoading, error, data, refetch, isSuccess } = useQuery<ColType[]>(
    [endpoint, { ...params }],
    {
      keepPreviousData: true,
      onSuccess(data) {
        // console.log(data)
        // const res = request.post('coin/store-array', data)
        setListCoinGraph(data.slice(0, 4))
      },
      retry: 3,
    },
  )
  const columns = React.useMemo<Column<ColType>[]>(
    () => [
      {
        Header: '#',
        accessor: 'market_cap_rank', // accessor is the "key" in the data
        width: 10,
        sticky: 'left',
      },
      {
        Header: t('name'),
        accessor: 'name',
        width: 150,
        sticky: 'left',
        Cell: ({ row }) => {
          return (
            <CustomLink to={`/currencies/${row.original.id || ''}`}>{row.original.name}</CustomLink>
          )
        },
      },
      {
        Header: t('price'),
        accessor: 'current_price',
        width: 30,
        Cell: ({ row }) => {
          return `${convertCurrency(row.original.current_price, row.original.symbol)}`
        },
      },
      {
        Header: '1h %',
        accessor: 'price_change_percentage_1h_in_currency',
        width: 30,
        Cell: ({ value }) => {
          return <TextChangePercent num={value} />
        },
      },
      {
        Header: '24h %',
        accessor: 'price_change_percentage_24h_in_currency',
        width: 30,
        Cell: ({ value }) => {
          return <TextChangePercent num={value} />
        },
      },
      {
        Header: '7d %',
        accessor: 'price_change_percentage_7d_in_currency',
        width: 30,
        Cell: ({ value }) => {
          return <TextChangePercent num={value} />
        },
      },
      {
        Header: t('market_cap'),
        accessor: 'market_cap',
        Cell: ({ value }) => {
          return `${convertCurrency(value)}`
        },
      },
      {
        Header: t('circulating_supply'),
        accessor: 'circulating_supply',
        Cell: ({ row }) => {
          return (
            <span style={{ textTransform: 'uppercase' }}>{`${numberWithCommas(
              removeDecimal(row.original.circulating_supply),
            )} ${row.original.symbol}`}</span>
          )
        },
      },
    ],
    [],
  )

  const grid = {
    xs: 12,
    md: 6,
  }

  const gridFull = {
    xs: 12,
    md: 12,
  }

  return (
    <Grid container spacing={3} pl={{ xs: 1, sm: 'unset' }}>
      <Grid item {...gridFull}>
        <ReactTableWithToolBar
          sxCustom={{ border: `1px solid ${strokeColor['primary']}` }}
          title={t('home.top_coin')}
          columns={columns}
          data={data || []}
          isLoading={isLoading}
          // isLoading={true}
          // handleChangeParams={handleChangeParams}
          // {...paginationData}
          // pageCount={10}
          // manualPagination={true}
        />
      </Grid>
      <Grid item {...grid}>
        <TrendingList />
      </Grid>

      <Grid item {...grid}>
        <TrendingList />
      </Grid>

      {listCoinGraph &&
        listCoinGraph.map((coin, index) => (
          <Grid item {...grid} key={index + 'key'}>
            <CoinGraph
              coin={coin}
              colorGraph={colorCoinGraph.colorGraph[index]}
              colorLine={colorCoinGraph.colorLine[index]}
            />
          </Grid>
        ))}
    </Grid>
  )
}
