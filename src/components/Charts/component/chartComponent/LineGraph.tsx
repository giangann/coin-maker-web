import ReactECharts from 'echarts-for-react'
import React from 'react'

import { BarLineChartOption, dataChartType } from '../BarLineChart'

export type LineChartPropsType = {
  data: dataChartType
  colorLine?: string
}

const LineChart: React.FC<LineChartPropsType> = ({ data, colorLine }) => {
  const option: BarLineChartOption = {
    xAxis: [
      {
        type: 'category',
        axisTick: {
          show: false,
          alignWithLabel: true,
          length: 8,
          lineStyle: {
            color: 'grey',
          },
        },
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
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
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],

    series: [
      {
        name: 'Price',
        type: 'line',
        symbolSize: 10,
        lineStyle: {
          width: 2,
          color: colorLine,
        },
        emphasis: {
          focus: 'series',
        },
        smooth: false,
        symbol: 'none',
        stack: 'confidence-band',
        data: data.dataY.price,
      },
    ],
  }

  return (
    <div>
      <ReactECharts option={option} style={{ height: '250px', width: '100%' }} lazyUpdate={true} />
    </div>
  )
}

export { LineChart }
