import React from 'react';
import propTypes from 'prop-types';
import { Cascader, Input } from 'antd';
import publicService from '@services/public';

/**
 * # 数据地址：~/public\geo-json
 * # 数据格式：[[地区],详细地址]
 * - [地区]：前三位是[省、市、区]，后面也许有其他的，取决于数据
 * */
class Area extends React.Component {
  static propTypes = {
    disabled: propTypes.bool,
    value: propTypes.array,
    onChange: propTypes.func,
  };
  static defaultProps = {
    disabled: false,
    onChange() {},
  };
  state = {
    isInit: false,
    options: [],
    area: [],
    address: '',
  };

  checkIsLeaf(properties) {
    return properties.childrenNum === 0;
  }

  transToOptions(features) {
    if (!features) return [];
    return features.map(({ properties }) => {
      return {
        adcode: properties.adcode,
        label: properties.name,
        value: properties.name,
        isLeaf: this.checkIsLeaf(properties),
      };
    });
  }

  componentDidMount() {
    this.getOptions().then(options => {
      this.setState({
        options,
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // 初始化
    if (!this.state.isInit && this.props.value && this.props.value[0]) {
      this.setState({
        isInit: true,
      });
      this.getOptionsByValue(this.props.value).then(options => {
        this.setState({
          options,
        });
      });
    }
  }

  loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    targetOption.children = await this.getOptions(targetOption.adcode);
    targetOption.loading = false;
    this.setState({});
  };
  getOptions = (code = 100000 /* china code */) => {
    return publicService.getGeoJSON(code).then(res => {
      return this.transToOptions(res.features);
    });
  };

  getOptionsByValue = async value => {
    value = value || this.props.value;

    const area = value[0];
    this.state.area = area;
    this.state.address = value[1];

    const options = this.state.options.length !== 0 ? this.state.options : await this.getOptions();
    let currentBlock = options;
    let current = null;
    let index = 0;
    while ((current = area[index++])) {
      currentBlock = currentBlock.find(item => item.value === current);
      if (!currentBlock || currentBlock.isLeaf) {
        break;
      }
      currentBlock = currentBlock.children = await this.getOptions(currentBlock.adcode);
    }
    return options;
  };

  handleAreaChange = (value, selectedOptions) => {
    this.setState(
      {
        area: value,
      },
      this.setValue,
    );
  };

  handleAddressChange = e => {
    this.setState(
      {
        address: e.currentTarget.value,
      },
      this.setValue,
    );
  };

  setValue = () => {
    /**
     * 约定，以数组的形式
     * */
    if (this.state.area.length === 0) {
      this.props.onChange([]);
      return;
    }

    this.props.onChange([this.state.area, this.state.address]);
  };

  render() {
    const { options, area, address } = this.state;
    const { className, style, disabled } = this.props;
    return (
      <div className={className} style={style}>
        <Cascader
          disabled={disabled}
          options={options}
          value={area}
          onChange={this.handleAreaChange}
          loadData={this.loadData}
          changeOnSelect
          placeholder="请选择所在地"
        />
        <Input.TextArea
          disabled={disabled}
          rows={2}
          value={address}
          onChange={this.handleAddressChange}
          placeholder="请输入详细地址"
        />
      </div>
    );
  }
}

export default Area;
