import React from 'react';
import echarts from 'echarts';
import ChartLife from '@components/ChartLife';
import publicService from '@services/public';

/**
 * block 代指了当前选择的项目
 * */
@ChartLife
class AbsorbedMap extends React.Component {
  isLoading = false;

  chart = null;
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
              color: '#333',
            },
            borderWidth: 0,
          },
          // emphasis: { label: { show: true } },
          // borderWidth: 0,
          // borderColor: '#eee',
        },
        data: [],
      },
    ],
    animation: true,
  };

  currentBlockMap = {};
  nameStack = [];
  codeStack = [];
  lastBlockCode = 100000; // CHINA_CODE
  state = {
    lastBlockName: '中华人民共和国', // CHINA_NAME
  };

  componentDidMount() {
    const { registerChart } = this.props;
    const chart = (this.chart = echarts.init(this.refs.chart));
    registerChart(chart);

    chart.on('click', this.handleChartClick);
    this.loadMapByBlockName(this.lastBlockCode); // CHINA_CODE
  }

  handleChartClick = param => {
    if (param.seriesName !== 'map') return;
    if (this.isLoading) return;
    const currentBlock = this.currentBlockMap[param.name];
    if (currentBlock.properties.level === 'district') return; // 观察数据，发现 level=district 时，为最小单位
    // #点击事件开始
    this.isLoading = true;
    const lastBlockCode = currentBlock.properties.adcode;
    const lastBlockName = currentBlock.properties.name;
    this.loadMapByBlockName(lastBlockCode).then(() => {
      // #点击事件结束
      this.codeStack.push(this.lastBlockCode);
      this.nameStack.push(this.state.lastBlockName);
      this.lastBlockCode = lastBlockCode;
      this.setState({
        lastBlockName,
      });
      this.isLoading = false;
    });
  };

  handleBack = () => {
    if (this.codeStack.length < 1) return;
    this.lastBlockCode = this.codeStack.pop();
    this.loadMapByBlockName(this.lastBlockCode);
    this.setState({
      lastBlockName: this.nameStack.pop(),
    });
  };

  genCurrentBlockMap = mapGeo => {
    const { features } = mapGeo;
    const currentBlockMap = {};
    features.forEach(item => {
      currentBlockMap[item.properties.name] = item;
    });
    return currentBlockMap;
  };

  loadMapByBlockName = async blockCode => {
    let mapGeo = echarts.getMap(blockCode);
    if (!mapGeo) {
      mapGeo = await publicService.getGeoJSON(blockCode);
      if (!mapGeo) {
        return;
      }
      echarts.registerMap(blockCode, mapGeo);
    } else {
      mapGeo = mapGeo.geoJson;
    }

    this.currentBlockMap = this.genCurrentBlockMap(mapGeo);
    const { chart, chartOption } = this;
    chartOption.series[0].mapType = blockCode;
    // test data
    chartOption.series[0].data = [
      {
        name: mapGeo.features[0].properties.name,
        value: 605.83,
      },
    ];
    chart.setOption(chartOption, true);
    this.chartOption = chartOption;
  };

  render() {
    return (
      <>
        {this.state.lastBlockName}
        <button onClick={this.handleBack}>返回</button>
        <div
          ref="chart"
          style={{
            width: '100%',
            height: '600px',
          }}
        ></div>
      </>
    );
  }
}

export default AbsorbedMap;
