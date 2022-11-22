import { Box, Stack, Typography } from '@mui/material'
import { graphic } from 'echarts'
import {
  CallbackDataParams,
  TooltipFormatterCallback,
  TopLevelFormatterParams,
} from 'echarts/types/dist/shared'
import ReactECharts from 'echarts-for-react'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

import { BarLineChartOption, dataChartType } from '../BarLineChart'

function Tooltip(props: any) {
  return (
    <Box style={{ width: 230, height: 120, borderRadius: 20 }}>
      <Stack direction="row" justifyContent="space-around" mt={2}>
        {/* <Typography>{props[1].name}</Typography> */}
        <Typography>{props[0].name}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" mt={2}>
        <Box
          sx={{ borderRadius: '100%', width: '15px', height: '15px', background: 'green', ml: 2 }}
        ></Box>
        <Typography ml={1}>Price: </Typography>
        <Typography fontWeight={700}>${props[0].value.toFixed(4)}</Typography>
      </Stack>
      <Stack direction="row" alignItems="center" mt={1}>
        <Box
          sx={{ borderRadius: '100%', width: '15px', height: '15px', background: 'green', ml: 2 }}
        ></Box>
        <Typography ml={1}>Sparkline: </Typography>
        <Typography fontWeight={700}>${props[1].value.toFixed(4)}</Typography>
      </Stack>
    </Box>
  )
}

export type PriceChartPropsType = {
  data: dataChartType
}

const PriceChart: React.FC<PriceChartPropsType> = ({ data }) => {
  const dataMax = Math.max(...data.dataY.volume)
  const priceMax = Math.max(...data.dataY.price)
  const priceMin = Math.min(...data.dataY.price)
  const arrayTemp = new Array(dataMax.toString().length).fill(0)
  arrayTemp.unshift(5)
  let roundingNumber = dataMax * 10

  const option: BarLineChartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
      },
      formatter: ((params: CallbackDataParams[]) => {
        return ReactDOMServer.renderToStaticMarkup(<Tooltip {...params} />)
      }) as TooltipFormatterCallback<TopLevelFormatterParams>,
      borderRadius: 0,
      padding: 0,
    },

    xAxis: [
      {
        type: 'category',
        axisTick: {
          show: true,
          alignWithLabel: true,
          length: 8,
          lineStyle: {
            color: 'grey',
          },
        },
        axisLabel: {
          color: 'grey',
          fontWeight: 700,
          fontSize: 14,
          margin: 18,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'lightgrey',
            width: 1,
            type: 'solid',
          },
        },
        data: data.dataX,
      },
    ],
    yAxis: [
      {
        type: 'value',
        min: function (value) {
          return value.min - (value.min * 5) / 100
        },

        axisLabel: {
          color: 'grey',
          fontSize: 14,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'lightgrey',
            width: 1,
            type: 'solid',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            width: 0.5,
            color: [
              'lightgrey',
              'lightgrey',
              'lightgrey',
              'lightgrey',
              'lightgrey',
              'lightgrey',
              'lightgrey',
              'transparent',
              'lightgrey',
              'lightgrey',
            ],
          },
        },
      },
      {
        type: 'value',
        show: true,
        max: roundingNumber,
        interval: roundingNumber / 10,
        axisLabel: {
          color: 'black',
          fontSize: 14,
          formatter: (value: number) => {
            switch (value) {
              case 0:
              case (roundingNumber * 3) / 10:
              case (roundingNumber * 5) / 10:
                return value.toString()
              case roundingNumber:
                return value + 'B'

              default:
                return ''
            }
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: 'grey',
            width: 1,
            type: 'solid',
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    dataZoom: [
      {
        show: true,
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    visualMap: {
      top: 2000,
      right: 10,

      dimension: 1,
      pieces: [
        {
          gt: 0,
          lte: (priceMax + priceMin) / 2,
          color: 'red',
        },
      ],
      outOfRange: {
        color: '#999',
      },
    },
    series: [
      {
        name: 'Price',
        type: 'line',
        symbolSize: 10,
        lineStyle: {
          width: 2,
        },
        emphasis: {
          focus: 'series',
        },
        smooth: false,
        symbol: 'none',
        stack: 'confidence-band',
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 0.5, [
            {
              offset: 0,
              color: 'green',
            },
            {
              offset: 1,
              color: '#0C1023',
            },
          ]),
          origin: 'start',
        },
        markLine: {
          silent: true,
          lineStyle: {
            color: 'white',
          },
          data: [
            {
              yAxis: (priceMax + priceMin) / 2,
            },
          ],
        },
        data: data.dataY.price,
      },
      {
        name: 'Volume',
        type: 'bar',
        yAxisIndex: 1,
        itemStyle: {
          borderRadius: [2, 2, 0, 0],
        },
        emphasis: {
          focus: 'series',
        },
        data: data.dataY.volume,
      },
    ],
  }

  return (
    <div>
      <ReactECharts option={option} style={{ height: '600px', width: '100%' }} lazyUpdate={true} />
    </div>
  )
}

export { PriceChart }
