import React from 'react'
import echarts from 'echarts'
import publicService from '@services/public'
import ChartLife from '@components/ChartLife'

/**
 * block 代指了当前选择的项目
 * */
@ChartLife
class AbsorbedMap extends React.Component {
  isLoading = false

  chart = null
  chartOption = {
    tooltip: {
      trigger: 'item',
    },
    dataRange: {
      // orient: 'horizontal',
      min: 0,
      max: 55000,
      text: ['高', '低'], // 文本，默认为数值文本
      calculable: true, // 是否可拖动计算
      // selectedMode: true,
      color: ['#2d70d6', '#80b5e9', '#e6feff'],
    },
    series: [
      {
        name: 'map',
        type: 'map',
        mapLocation: {
          x: 'left',
        },
        // selectedMode: 'multiple',
        itemStyle: {
          normal: {
            label: {
              show: true,
              color: '#333'
            },
            borderWidth: 0
          },
          // emphasis: { label: { show: true } },
          // borderWidth: 0,
          // borderColor: '#eee',
        },
        data: [],
      },
    ],
    animation: true,
  }

  currentBlockMap = {}
  codeStack = []
  currentCode = 100000 // CHINA_CODE

  componentDidMount() {
    const { registerChart } = this.props
    const chart = this.chart = echarts.init(this.refs.chart)
    registerChart(chart)

    chart.on('click', this.handlerChartClick)
    this.loadMapByBlockName(this.currentCode) // CHINA_CODE
  }

  handlerChartClick = param => {
    if (param.seriesName !== 'map') return
    if (this.isLoading) return
    const currentBlock = this.currentBlockMap[param.name]
    if (currentBlock.properties.level === 'district') return // 观察数据，发现 level=district 时，为最小单位
    // #点击事件开始
    this.isLoading = true
    this.codeStack.push(this.currentCode)
    this.currentCode = currentBlock.properties.adcode
    this.loadMapByBlockName(this.currentCode)
      .then(() => {
        // #点击事件结束
        this.isLoading = false
      })
  }

  handlerBack = () => {
    if (this.codeStack.length < 1) return
    this.currentCode = this.codeStack.pop()
    this.loadMapByBlockName(this.currentCode)
  }

  genCurrentBlockMap = mapGeo => {
    const { features } = mapGeo
    const currentBlockMap = {}
    features.forEach(item => {
      currentBlockMap[item.properties.name] = item
    })
    return currentBlockMap
  }

  loadMapByBlockName = async blockCode => {
    let mapGeo = echarts.getMap(blockCode)
    if (!mapGeo) {
      mapGeo = await publicService.getGeoJSON(blockCode)
      if (!mapGeo) {
        this.currentCode = this.codeStack.pop()
        return
      }
      echarts.registerMap(blockCode, mapGeo)
    } else {
      mapGeo = mapGeo.geoJson
    }

    this.currentBlockMap = this.genCurrentBlockMap(mapGeo)
    const { chart, chartOption } = this
    chartOption.series[0].mapType = blockCode
    // test data
    chartOption.series[0].data = [
      {
        name: mapGeo.features[0].properties.name,
        value: 605.83
      },
    ]
    chart.setOption(chartOption, true)
    this.chartOption = chartOption
  }

  render() {
    return (
      <>
        <button onClick={this.handlerBack}>返回</button>
        <div ref="chart" style={{
          width: '100%',
          height: '600px'
        }}>
        </div>
      </>
    )
  }
}

export default AbsorbedMap

