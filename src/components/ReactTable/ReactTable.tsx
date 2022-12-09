/* eslint-disable react/jsx-key */
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { Row as RowProps, TableOptions, usePagination, useSortBy, useTable } from 'react-table'
import styled from 'styled-components'

import { ArrowDropDownIcon, ArrowDropUpIcon, FilterOutline } from '@/components'
import { EmptyTable } from '@/components/ReactTable'
import { TableSkeleton } from '@/components/Skeleton'
import { backgroundColor, grey } from '@/styles'
// Pass params
// pageCount={10}
// manualPagination={true}
// to react table to enable pagination controlled

interface TableProperties<T extends object> extends TableOptions<T> {
  loading?: boolean
  handleChangeParams?: any
  pageCount?: number
  isSuccess?: boolean
  handleChangePagination?: any
  isLoading?: boolean
  onRowClick?(row: RowProps<T>): void
}

const Styles = styled.div`
  display: block;
  max-width: 100%;

  /* This will make the table scrollable when it gets too small */
  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
    border-bottom: 1px solid #eff2f5;
  }
  .tableWrap::-webkit-scrollbar {
    height: 5px;
    background-color: #f5f5f5;
  }

  .tableWrap::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }
  .tableWrap::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #555;
  }

  table {
    /* Make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;

    tr {
      color: #fff;

      :last-child {
        td {
          border-bottom: 0;
        }
      }
      &:hover {
        // background-color: rgb(248, 250, 253);
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;

      border-bottom: 1px solid rgba(196, 196, 196, 0.56);

      font-weight: 700;

      /* The secret sauce */
      /* Each cell should grow equally */
      width: 1%;
      /* But "collapsed" cells should be as small as possible */
      &.collapse {
        width: 0.0000000001%;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`
function ReactTable<T extends object>(props: TableProperties<T>): ReactElement {
  const {
    columns,
    data,
    loading,
    isLoading,
    handleChangeParams,
    onRowClick,
    pageCount: controlledPageCount,
    handleChangePagination,
    ...useTableOptions
  } = props

  const hasRowClick = typeof onRowClick === 'function'

  const instance = useTable<T>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },

      // Pagination controller
      // pageCount: controlledPageCount,
      // manualPagination: true,

      ...useTableOptions,
    },
    useSortBy,
    usePagination,
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,

    // usePagination
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = instance

  const { t } = useTranslation()

  // console.log({ useTableOptions })

  // console.log({ pageIndex, pageSize, rows, page, pageOptions, gotoPage, nextPage })

  React.useEffect(() => {
    // console.log({ pageIndex, pageSize })
    // handleChangeParams({ _page: pageIndex, _limit: pageSize })
  }, [pageIndex, pageSize])

  // useEffect(() => {
  //   if (typeof handleChangePagination === 'function') {
  //     handleChangePagination({ _page: pageIndex + 1, _limit: pageSize })
  //   }
  // }, [handleChangePagination, pageIndex, pageSize])
  return (
    <>
      {isLoading && !data.length ? (
        <TableSkeleton />
      ) : !loading && !data.length ? (
        <EmptyTable />
      ) : (
        <Styles>
          <div
            style={{
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontWeight: 500, fontSize: 14, color: '#fff', opacity: 0.6 }}>
              {t('table.rows_per_page')}{' '}
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value))
              }}
              style={{
                padding: 4,
                height: 29,
                backgroundColor: grey['primary'],
                cursor: 'pointer',
                borderRadius: 8,
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: 4,
                backgroundColor: grey['primary'],
                fontSize: 14,
                fontWeight: 'bold',
                height: 27,
                gap: 4,
                cursor: 'pointer',
                borderRadius: 8,
              }}
            >
              <FilterOutline />
              {t('filter')}
            </span>
          </div>

          <div className="tableWrap">
            <table {...getTableProps()} style={{ borderSpacing: 0 }}>
              <thead>
                {headerGroups.map((headerGroup) => {
                  return (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, index) => {
                        return (
                          <th
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            style={{
                              whiteSpace: 'nowrap',
                              fontWeight: 'bold',
                              minWidth: column.minWidth,
                              width: column.width,
                              textAlign: 'left',
                              cursor: 'pointer',
                              ...column.style,
                              ...stickyFirstCol(index),
                            }}
                          >
                            {column.render('Header')}
                            <span style={{ position: 'relative', top: '2px' }}>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <ArrowDropDownIcon />
                                ) : (
                                  <ArrowDropUpIcon />
                                )
                              ) : (
                                ''
                              )}
                            </span>
                          </th>
                        )
                      })}
                    </tr>
                  )
                })}
              </thead>
              <tbody {...getTableBodyProps()}>
                {/* {rows.map((row) => { */}
                {page.map((row) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()} onClick={() => hasRowClick && onRowClick(row)}>
                      {row.cells.map((cell, index) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            style={{
                              padding: '10px',
                              minWidth: cell.column.minWidth,
                              width: cell.column.width,
                              ...cell.column.style,
                              ...stickyFirstCol(index),
                            }}
                          >
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="pagination" style={{ textAlign: 'right' }}>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {'>'}
            </button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {'>>'}
            </button>{' '}
            <span style={{ color: '#fff' }}>
              {t('table.page')}{' '}
              <strong>
                {pageIndex + 1} <span style={{ textTransform: 'lowercase' }}>{t('of')}</span>{' '}
                {pageOptions.length}
              </strong>{' '}
            </span>
          </div>
        </Styles>
      )}
    </>
  )
}

export { ReactTable }

const stickyFirstCol = (index: number) =>
  index <= 1 &&
  ({
    position: 'sticky',
    left: index * 38,
    zIndex: 10,
    backgroundColor: backgroundColor['primary'],
  } as React.CSSProperties)
