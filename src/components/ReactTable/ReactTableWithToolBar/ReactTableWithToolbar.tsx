import React from 'react'
import { TableOptions } from 'react-table'

import { Page } from '@/components/Layouts'
import { ReactTable } from '@/components/ReactTable'

interface ReactTableWithToolBarProps<T extends object> extends TableOptions<T> {
  data: readonly T[]
  columns: any[]
  title?: string
  sxCustom?: any
}

function ReactTableWithToolBar<T extends object>({
  data,
  columns,
  title,
  sxCustom,
  ...props
}: ReactTableWithToolBarProps<T>) {
  return (
    <Page title={title} sxCustom={sxCustom}>
      <ReactTable
        columns={columns}
        data={data || []}
        // handleChangeParams={handleChangeParams}
        // {...paginationData}
      />
    </Page>
  )
}

export { ReactTableWithToolBar }
