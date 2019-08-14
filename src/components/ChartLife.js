import React from 'react'

const chartMap = {}

if (typeof window !== 'undefined') {
  window.addEventListener('resize', function () {
    for (let k in chartMap) {
      chartMap[k].resize()
    }
  })
}

export default function (Target) {
  return class ChartHoc extends React.Component {
    chartId = null

    componentWillUnmount() {
      if (!chartMap[this.chartId]) return
      chartMap[this.chartId].dispose()
      delete chartMap[this.chartId]
      console.log('chartMap：\n', chartMap)
    }

    registerChart = chart => {
      this.chartId = chart.id
      chartMap[chart.id] = chart
    }

    render() {
      return <Target registerChart={this.registerChart}></Target>
    }
  }
}
