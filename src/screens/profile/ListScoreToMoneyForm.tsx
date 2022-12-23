import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Row as RowProps } from 'react-table'

import { Card } from '@/components'
import { ScoreToMoneyFormType } from '@/components/Form'
import { ReactTableWithToolBar } from '@/components/ReactTable'
import { StatusTag } from '@/components/Tag/StatusTag'
import { useAuth } from '@/libs/hooks'
import { convertDatetimeTZWithoutSecond, numberWithCommas } from '@/libs/utils'

export const ListScoreToMoneyForm = () => {
  const { t } = useTranslation()
  const { isAdmin, userStorage } = useAuth()
  const navigate = useNavigate()
  const { data: listFormData, isLoading: isLoading } = useQuery<ScoreToMoneyFormType[]>([
    'score-to-money-form',
    {
      user_id: userStorage?.id,
    },
  ])

  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id', // accessor is the "key" in the data
        width: 10,
        sticky: 'left',
      },
      {
        Header: t('user.name'),
        accessor: 'user.name', // accessor is the "key" in the data
        width: 100,
        sticky: 'left',
      },
      {
        Header: t('user.phone_number'),
        accessor: 'phone_number', // accessor is the "key" in the data
        width: 100,
        sticky: 'left',
      },
      {
        Header: t('form.points'),
        accessor: 'points', // accessor is the "key" in the data
        width: 50,
        sticky: 'left',
      },
      {
        Header: t('form.money'),
        accessor: 'money', // accessor is the "key" in the data
        width: 50,
        Cell: ({ value }: { value: number }) => {
          return `${numberWithCommas(value)}đ`
        },
        sticky: 'left',
      },
      {
        Header: t('form.status'),
        accessor: 'status', // accessor is the "key" in the data
        width: 150,
        Cell: ({ value }: { value: number }) => {
          return <StatusTag value={value} />
        },
        sticky: 'left',
      },
      {
        Header: t('form.created_at'),
        accessor: 'created_at', // accessor is the "key" in the data
        width: 150,
        Cell: ({ row }: { row: any }) => {
          const asiaDate = convertDatetimeTZWithoutSecond(row.original.created_at)
          return asiaDate
        },
        sticky: 'left',
      },
      {
        Header: t('form.updated_at'),
        accessor: 'updated_at', // accessor is the "key" in the data
        width: 150,
        Cell: ({ row }: { row: any }) => {
          const asiaDate = convertDatetimeTZWithoutSecond(row.original.updated_at)
          return asiaDate
        },
        sticky: 'left',
      },
    ],
    [],
  )

  const onRowClick = (row: RowProps<ScoreToMoneyFormType>) => {
    navigate(`/form/${row.values.id}`)
  }

  return (
    <Card title={t('form.list_score_to_money_form')} hasMore={false} sxTitle={{ mb: 0, mt: 2 }}>
      <ReactTableWithToolBar
        columns={columns}
        data={listFormData || []}
        isLoading={isLoading}
        onRowClick={onRowClick}
        sxCustom={{ padding: 0 }}
      />
    </Card>
  )
}
