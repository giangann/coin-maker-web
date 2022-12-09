import React from 'react'
import { useQuery } from 'react-query'
import { Row as RowProps } from 'react-table'

import { Card } from '@/components'
import { ScoreToMoneyFormType } from '@/components/Form'
import { ReactTableWithToolBar } from '@/components/ReactTable'
import { StatusTag } from '@/components/Tag/StatusTag'
import { numberWithCommas } from '@/libs/utils'

export const ListScoreToMoneyForm = () => {
  const { data: listFormData, isLoading: isLoading } =
    useQuery<ScoreToMoneyFormType[]>('score-to-money-form')

  console.log('listformDaa', listFormData)
  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id', // accessor is the "key" in the data
        width: 10,
        sticky: 'left',
      },
      {
        Header: 'User name',
        accessor: 'user.name', // accessor is the "key" in the data
        width: 100,
        sticky: 'left',
      },
      {
        Header: 'Phone number',
        accessor: 'phone_number', // accessor is the "key" in the data
        width: 100,
        sticky: 'left',
      },
      {
        Header: 'Points',
        accessor: 'points', // accessor is the "key" in the data
        width: 50,
        sticky: 'left',
      },
      {
        Header: 'Money',
        accessor: 'money', // accessor is the "key" in the data
        width: 50,
        Cell: ({ value }: { value: number }) => {
          return `${numberWithCommas(value)}đ`
        },
        sticky: 'left',
      },
      {
        Header: 'Status',
        accessor: 'status', // accessor is the "key" in the data
        width: 100,
        Cell: (value: number) => {
          return <StatusTag value={value} />
        },
        sticky: 'left',
      },
      {
        Header: 'Creaed at',
        accessor: 'created_at', // accessor is the "key" in the data
        width: 200,
        sticky: 'left',
      },
      {
        Header: 'Updated at',
        accessor: 'updated_at', // accessor is the "key" in the data
        width: 200,
        sticky: 'left',
      },
    ],
    [],
  )

  const onRowClick = (row: RowProps<ScoreToMoneyFormType>) => {
    console.log(row)
  }

  return (
    <Card title="List score to money request" hasMore={false}>
      <ReactTableWithToolBar
        columns={columns}
        data={listFormData || []}
        isLoading={isLoading}
        onRowClick={onRowClick}
      />
    </Card>
  )
}
