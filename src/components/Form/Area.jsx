import React from 'react';
import propTypes from 'prop-types';
import { Cascader, Input } from 'antd';
import publicService from '@services/public';

/**
 * # 数据地址：~/public\geo-json
 * # 数据格式：[[地区],详细地址]
 * - [地区]：前三位是[省、市、区]，后面也许有其他的，取决于数据
 * 2019年8月29日
 * add propTypes.useAddress
 * 默认开启，禁用之后数据格式为：[省市区]
 * */
class Area extends React.Component {
  static propTypes = {
    useAddress: propTypes.bool,
    disabled: propTypes.bool,
    value: propTypes.array,
    placeholder: propTypes.string,
    onChange: propTypes.func,
  };
  static defaultProps = {
    useAddress: true,
    disabled: false,
    placeholder: '请选择所在地',
    onChange() {},
  };

  state = {
    isInit: false,
    options: [],
    area: [],
    address: '',
    addressTouched: false,
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
        addressTouched: true,
      });
      this.getOptionsByValue(this.props.value).then(options => {
        this.setState(
          {
            options,
          },
          () => {
            if (!this.props.disabled) {
              this.setValue();
            }
          },
        );
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

    let area = null;
    if (this.props.useAddress) {
      area = value[0];
      this.state.address = value[1];
    } else {
      area = value;
    }
    this.state.area = area;

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
        addressTouched: true,
      },
      this.setValue,
    );
  };

  setValue = () => {
    if (!this.props.useAddress) {
      this.props.onChange(this.state.area);
      return;
    }
    /**
     * 数据格式：[[省、市、区],详细地址]
     * */
    if (!this.state.addressTouched) return;
    if (this.state.area.length === 0 || !this.state.address) {
      this.props.onChange([]);
      return;
    }
    this.props.onChange([this.state.area, this.state.address]);
  };

  render() {
    const { options, area, address } = this.state;
    const { className, style, disabled, useAddress, placeholder } = this.props;
    return (
      <div className={className} style={style}>
        <Cascader
          disabled={disabled}
          options={options}
          value={area}
          onChange={this.handleAreaChange}
          loadData={this.loadData}
          changeOnSelect
          placeholder={placeholder}
        />
        {useAddress && (
          <Input.TextArea
            disabled={disabled}
            rows={2}
            value={address}
            onChange={this.handleAddressChange}
            placeholder="请输入详细地址"
          />
        )}
      </div>
    );
  }
}

export default Area;
