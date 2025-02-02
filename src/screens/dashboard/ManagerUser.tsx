import React from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Row as RowProps } from 'react-table'

import { Card } from '@/components'
import { ReactTableWithToolBar } from '@/components/ReactTable'
import { UserType } from '@/libs/types'
import { convertDatetimeTZWithoutSecond } from '@/libs/utils'
import { DotWithColor } from '@/styles'

export const ManagerUser = () => {
  const { data: userData, isLoading: isLoading } = useQuery<UserType>('user')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id', // accessor is the "key" in the data
        width: 10,
        sticky: 'left',
      },
      {
        Header: t('manage_user.name'),
        accessor: 'name',
        width: 100,
        sticky: 'left',
      },
      {
        Header: t('manage_user.email'),
        accessor: 'email',
        width: 50,
        sticky: 'left',
      },
      {
        Header: t('manage_user.score'),
        accessor: 'score',
        width: 10,
        sticky: 'left',
      },
      {
        Header: t('form.created_at'),
        accessor: 'created_at',
        width: 50,
        Cell: ({ row }: { row: any }) => {
          const asiaDate = convertDatetimeTZWithoutSecond(row.original.created_at)
          return asiaDate
        },
        sticky: 'left',
      },
      {
        Header: t('manage_user.is_admin'),
        accessor: 'is_admin',
        width: 20,
        Cell: ({ value }: any) => {
          return value ? <DotWithColor dotColor="green" size={12} /> : ' '
        },
        sticky: 'left',
      },
    ],
    [],
  )

  const onRowClick = (row: RowProps<UserType>) => {
    const userId = row.values.id
    navigate(`/manager/user/${userId}`)
  }

  return (
    <Card title={t('manage_user.title')} hasMore={false} sxTitle={{ mb: 0, mt: 2 }}>
      <ReactTableWithToolBar
        sxCustom={{ padding: 0 }}
        isLoading={isLoading}
        columns={columns}
        data={userData as any}
        onRowClick={onRowClick}
      />
    </Card>
  )
}
