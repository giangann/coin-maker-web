import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'

export type Pagination<T> = {
  data: T[]
  meta: {
    pagination: {
      current_page: number
      from: number
      total_pages: number
      per_page: number
      to: number
      total: number
    }
  }
}
export type PaginationMeta = {
  page: number
  per_page: number
}
function usePaginationQuery<T>(
  endpoint: string,
  params?: Record<string, unknown>,
  enabled?: boolean,
) {
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    per_page: 20,
  })

  const [_params, setParams] = useState(params)

  const queryClient = useQueryClient()

  const { data, isFetching, isPreviousData, refetch, ...queryResult } = useQuery<Pagination<T>>(
    [endpoint, { ...meta, ...params, ..._params }],
    {
      keepPreviousData: true,
      staleTime: 10000,
      enabled,
    },
  )

  useEffect(() => {
    if (!data) return
    const hasMore = data.meta.pagination.current_page < data.meta.pagination.total_pages
    if (hasMore) {
      queryClient.prefetchQuery([
        endpoint,
        { page: meta.page + 1, per_page: params?.per_page || meta.per_page },
      ])
    }
  }, [data, endpoint, meta, queryClient])

  const handleChangePagination = useCallback((paginationMeta: PaginationMeta) => {
    setMeta(paginationMeta)
  }, [])

  const handleChangeParams = useCallback((newParams) => {
    setParams(newParams)
  }, [])

  const handleAddParams = useCallback((additionalParams) => {
    setParams({
      ...params,
      ...additionalParams,
    })
  }, [])

  const paginationData = useMemo(
    () => ({
      data: data?.data || [],
      pageCount: data?.meta.pagination.total_pages,
      loading: isFetching,
      isPreviousData,
      handleChangePagination,
    }),
    [data, isFetching, isPreviousData, handleChangePagination],
  )

  return { paginationData, handleChangeParams, handleAddParams, refetch, ...queryResult }
}

export { usePaginationQuery }
