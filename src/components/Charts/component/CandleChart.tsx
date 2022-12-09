import ReactECharts from 'echarts-for-react'
import React from 'react'

const upColor = '#00da3c'
const downColor = '#ec0000'

export type CandleChartType = {
  dataCandle: number[][]
}

function splitData(rawData: string | any[]) {
  const categoryData = []
  const values = []
  for (var i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i].splice(0, 1)[0])
    values.push(rawData[i])
  }
  return {
    categoryData: categoryData,
    values: values,
  }
}
function calculateMA(dayCount: number, data: { values: number[][] }) {
  var result = []
  for (var i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push('-')
      continue
    }
    var sum = 0
    for (var j = 0; j < dayCount; j++) {
      sum += +data.values[i - j][1]
    }
    result.push(sum / dayCount)
  }
  return result
}

const CandleChart: React.FC<CandleChartType> = ({ dataCandle }) => {
  const newDataCandle = dataCandle.map((item) => {
    const timeChart = new Date(item[0]).toLocaleDateString('en-US')
    const newItem = [timeChart, ...item.slice(1, 5)]
    return newItem
  })
  console.log('kaka', newDataCandle)

  const data = splitData(newDataCandle as number[][])

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      top: 10,
      left: 'center',
      data: ['Dow-Jones index', 'MA5', 'MA10', 'MA20', 'MA30'],
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
    },
    xAxis: {
      type: 'category',
      data: data.categoryData,
      boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
    },
    yAxis: {
      scale: true,
      splitArea: {
        show: true,
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 50,
        end: 100,
      },
      {
        show: true,
        type: 'slider',
        top: '90%',
        start: 50,
        end: 100,
      },
    ],
    series: [
      {
        name: 'Dow-Jones index',
        type: 'candlestick',
        data: data.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
        markPoint: {
          label: {
            formatter: function (param: { value: number } | null) {
              return param != null ? Math.round(param.value) + '' : ''
            },
          },
          data: [
            {
              name: 'Mark',
              coord: ['2013/5/31', 2300],
              value: 2300,
              itemStyle: {
                color: 'rgb(41,60,85)',
              },
            },
            {
              name: 'highest value',
              type: 'max',
              valueDim: 'highest',
            },
            {
              name: 'lowest value',
              type: 'min',
              valueDim: 'lowest',
            },
            {
              name: 'average value on close',
              type: 'average',
              valueDim: 'close',
            },
          ],
          tooltip: {
            formatter: function (param: { name: string; data: { coord: any } }) {
              return param.name + '<br>' + (param.data.coord || '')
            },
          },
        },
        markLine: {
          symbol: ['none', 'none'],
          data: [
            [
              {
                name: 'from lowest to highest',
                type: 'min',
                valueDim: 'lowest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: false,
                  },
                },
              },
              {
                type: 'max',
                valueDim: 'highest',
                symbol: 'circle',
                symbolSize: 10,
                label: {
                  show: false,
                },
                emphasis: {
                  label: {
                    show: false,
                  },
                },
              },
            ],
            {
              name: 'min line on close',
              type: 'min',
              valueDim: 'close',
            },
            {
              name: 'max line on close',
              type: 'max',
              valueDim: 'close',
            },
          ],
        },
      },
      {
        name: 'MA5',
        type: 'line',
        data: calculateMA(5, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'MA10',
        type: 'line',
        data: calculateMA(10, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'MA20',
        type: 'line',
        data: calculateMA(20, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
      {
        name: 'MA30',
        type: 'line',
        data: calculateMA(30, data),
        smooth: true,
        lineStyle: {
          opacity: 0.5,
        },
      },
    ],
  }

  return (
    <div>
      <ReactECharts option={option} style={{ height: '500px', width: '100%' }} lazyUpdate={true} />
    </div>
  )
}

export { CandleChart }
