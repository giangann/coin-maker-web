import { Box, BoxProps } from '@mui/material'
import { BarSeriesOption, DataZoomComponentOption, LineSeriesOption } from 'echarts'
import { BarChart as EBarChart, CandlestickChart, LineChart } from 'echarts/charts'
import {
  AxisPointerComponent,
  AxisPointerComponentOption,
  BrushComponent,
  BrushComponentOption,
  DataZoomComponent,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  ToolboxComponent,
  TooltipComponent,
  TooltipComponentOption,
  VisualMapComponent,
} from 'echarts/components'
import type { ComposeOption, ECharts } from 'echarts/core'
import { use } from 'echarts/core'
import { LabelLayout } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import {
  CandlestickSeriesOption,
  LegendComponentOption,
  ToolboxComponentOption,
  TooltipOption,
  VisualMapComponentOption,
} from 'echarts/types/dist/shared'
import { forwardRef, useRef } from 'react'

import { CoreChart, CoreChartProps } from './Core'
import { MarketChartOption } from './MarketChartOption'
import { PriceOption } from './PriceOption'

use([
  TooltipComponent,
  EBarChart,
  CanvasRenderer,
  LabelLayout,
  GridComponent,
  LineChart,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent,
  LegendComponent,
  CandlestickChart,
  AxisPointerComponent,
  GridComponent,
  BrushComponent,
])

export type data = {
  year: string
  dataX: string[]
  dataY: {
    two: number[]
    four: number[]
  }
}

export type BarLineChartOption = ComposeOption<
  | TooltipComponentOption
  | BarSeriesOption
  | GridComponentOption
  | LineSeriesOption
  | TooltipOption
  | DataZoomComponentOption
  | ToolboxComponentOption
  | VisualMapComponentOption
  | LegendComponentOption
  | CandlestickSeriesOption
  | AxisPointerComponentOption
  | GridComponentOption
  | BrushComponentOption
>

type BarLineChartProps = BoxProps<'div', CoreChartProps<BarLineChartOption>> & {
  data: data
  isMarketOption?: boolean
  isPriceOption?: boolean
}

const BarLineChart = forwardRef<ECharts, BarLineChartProps>(function Bar(props, ref) {
  const { data, isMarketOption, isPriceOption, ...boxProps } = props

  const chartRef = useRef<ECharts>(null)

  return (
    <Box width="100%" {...boxProps}>
      {isMarketOption && <CoreChart options={MarketChartOption(data)} ref={chartRef} />}
      {isPriceOption && <CoreChart options={PriceOption(data)} ref={chartRef} />}
    </Box>
  )
})

export { BarLineChart }
