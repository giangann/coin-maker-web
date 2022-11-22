import type { ECharts, SetOptionOpts } from 'echarts/core'
import { getInstanceByDom, init } from 'echarts/core'
import { ECBasicOption } from 'echarts/types/dist/shared'
import React, { useEffect, useImperativeHandle, useRef } from 'react'

// Redeclare forwardRef
declare module 'react' {
  function forwardRef<T, P = Record<string, unknown>>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null
}

export type CoreChartProps<T> = {
  options?: T
  loading?: boolean
  settings?: SetOptionOpts
}

function CoreChartInner<T extends ECBasicOption>(
  { options, loading, settings }: CoreChartProps<T>,
  ref: React.ForwardedRef<ECharts>,
) {
  const chartRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => chartRef.current as unknown as ECharts, [])

  useEffect(() => {
    // Initialize chart
    let chart: ECharts | undefined
    if (chartRef.current !== null) {
      chart = init(chartRef.current)
    }

    function resizeChart() {
      chart && chart.resize()
    }

    window.addEventListener('resize', resizeChart)
    // Return cleanup function
    return () => {
      chart && chart.dispose()
      window.removeEventListener('resize', resizeChart)
    }
  }, [])

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current)
      chart && options && chart.setOption(options, settings)
    }
  }, [options, settings])

  useEffect(() => {
    // Update chart
    if (chartRef.current !== null) {
      const chart = getInstanceByDom(chartRef.current)
      if (chart) {
        loading ? chart.showLoading() : chart.hideLoading()
      }
    }
  }, [loading])

  return <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
}

export const CoreChart = React.forwardRef(CoreChartInner)
