import './YearPicker.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import { Input, Icon } from 'antd';
import 'antd/lib/date-picker/style';
import { checkEventTargetIsInTarget } from '@utils/utils';

const currentYear = new Date().getFullYear();

class YearPicker extends React.Component {
  static propTypes = {
    value: propTypes.oneOfType([propTypes.number, propTypes.string]), // 数字为主
    onChange: propTypes.func,

    placeholder: propTypes.string,
    disabledDate: propTypes.func,
    disabledYearList: propTypes.array, // 与 disabledDate 只能存在一个
  };
  static defaultProps = {
    onChange() {},
  };

  pickId = 'ant-year-picker' + Date.now();
  pickPosition = {
    x: 0,
    y: 0,
  };
  elBodyContainer = null;
  refInput = null;

  isInit = false;

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      currentYear: !this.props.value ? currentYear : Number(this.props.value),
      yearList: this.getYearListByYear(currentYear),
    };
    if (!this.props.disabledDate) {
      if (!this.props.disabledYearList) {
        this.disabledDate = function() {
          return false;
        };
      } else {
        this.disabledDate = year => {
          return this.props.disabledYearList.includes(year);
        };
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // 初始化
    if (!this.isInit && this.props.value) {
      const newYear = this.props.value;
      this.isInit = true;
      this.setState({
        currentYear: Number(newYear),
        yearList: this.getYearListByYear(newYear),
      });
    }
  }

  componentDidMount() {
    this.elBodyContainer = document.createElement('div');
    this.elBodyContainer.id = this.pickId;
    document.body.appendChild(this.elBodyContainer);

    // compute pickPosition
    const elInput = this.refInput.input;
    const rectInfo = elInput.getBoundingClientRect();
    this.pickPosition = {
      x: rectInfo.left,
      y: rectInfo.top + elInput.offsetHeight + 6, // input 高度
    };
  }

  componentWillUnmount() {
    document.body.removeChild(this.elBodyContainer);
  }

  getClassName(year, isDisabled) {
    let base = 'ant-calendar-year-panel-cell';
    // && !isDisabled
    if (this.state.currentYear === year) {
      base += ' ant-calendar-year-panel-selected-cell';
    }
    if (isDisabled) {
      base += ' ant-calendar-disabled-cell';
    }
    return base;
  }

  getYearListByYear(year) {
    const temp = 12 * ~~(year / 12);
    return [
      temp + 1,
      temp + 2,
      temp + 3,
      temp + 4,
      temp + 5,
      temp + 6,

      temp + 7,
      temp + 8,
      temp + 9,
      temp + 10,
      temp + 11,
      temp + 12,
    ];
  }

  open = () => {
    this.setState({
      visible: true,
    });
  };
  close = () => {
    this.setState({
      visible: false,
    });
  };

  setValue = year => {
    this.setState({
      currentYear: year,
    });
    this.close();

    if (this.state.currentYear === year) {
      return;
    }
    this.props.onChange(year);
  };

  handleMousedown = () => {
    window.addEventListener(
      'mousedown',
      e => {
        if (!checkEventTargetIsInTarget(e, this.elBodyContainer)) {
          this.close();
        } else {
          this.handleMousedown();
        }
      },
      {
        once: true,
      },
    );
  };

  handleInputFocus = () => {
    this.open();
    this.handleMousedown();
  };

  handleYearNumClick = e => {
    const year = Number(e.currentTarget.title);
    if (this.disabledDate(year)) {
      return;
    }

    this.setValue(year);
  };

  handleClickNextPage = () => {
    const newYear = this.state.currentYear - 12;
    this.setState({
      currentYear: newYear,
      yearList: this.getYearListByYear(newYear),
    });
  };

  handleClickPrevPage = () => {
    const newYear = this.state.currentYear + 12;
    this.setState({
      currentYear: newYear,
      yearList: this.getYearListByYear(newYear),
    });
  };

  reset = () => {
    this.setState({
      yearList: this.getYearListByYear(currentYear),
    });
    this.setValue(currentYear);
  };

  renderPanel = () => {
    const { visible, currentYear, yearList } = this.state;
    if (!visible) {
      this.elBodyContainer && ReactDOM.render(null, this.elBodyContainer);
      return;
    }

    const yearNodeList = [];
    for (let i = 0; i < yearList.length; i += 3) {
      const year = yearList[i];
      yearNodeList.push(
        // ant-calendar-year-panel-last-decade-cell
        <tr role="row" key={i}>
          <td role="gridcell" className={this.getClassName(year, this.disabledDate(year))}>
            <a
              className="ant-calendar-year-panel-year"
              title={year}
              onClick={this.handleYearNumClick}
            >
              {year}
            </a>
          </td>
          <td role="gridcell" className={this.getClassName(year + 1, this.disabledDate(year + 1))}>
            <a
              className="ant-calendar-year-panel-year"
              title={year + 1}
              onClick={this.handleYearNumClick}
            >
              {year + 1}
            </a>
          </td>
          <td role="gridcell" className={this.getClassName(year + 2, this.disabledDate(year + 2))}>
            <a
              className="ant-calendar-year-panel-year"
              title={year + 2}
              onClick={this.handleYearNumClick}
            >
              {year + 2}
            </a>
          </td>
        </tr>,
      );
    }

    ReactDOM.render(
      <div
        className="ant-calendar ant-year-picker"
        style={{ top: this.pickPosition.y + 'px', left: this.pickPosition.x + 'px' }}
      >
        <div className="ant-calendar-panel">
          <div tabIndex="0" className="ant-calendar-date-panel">
            <div className="ant-calendar-header">
              <div className="ant-calendar-year-panel">
                <div>
                  <div className="ant-calendar-year-panel-header">
                    {currentYear > 12 && (
                      <a
                        className="ant-calendar-year-panel-prev-decade-btn"
                        role="button"
                        title="上一页"
                        onClick={this.handleClickNextPage}
                      ></a>
                    )}

                    <a
                      className="ant-calendar-year-panel-decade-select"
                      role="button"
                      title="Choose a decade"
                    >
                      {`${yearList[0]}-${yearList[yearList.length - 1]}`}
                    </a>
                    <a
                      className="ant-calendar-year-panel-next-decade-btn"
                      role="button"
                      title="下一页"
                      onClick={this.handleClickPrevPage}
                    ></a>
                  </div>
                  <div className="ant-calendar-year-panel-body">
                    <table className="ant-calendar-year-panel-table" cellSpacing="0" role="grid">
                      <tbody className="ant-calendar-year-panel-tbody">{yearNodeList}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ height: '226px' }}></div>
          </div>
          <div className="ant-calendar-footer">
            <span className="ant-calendar-footer-btn">
              <a className="ant-calendar-today-btn " role="button" onClick={this.reset}>
                今年
              </a>
            </span>
          </div>
        </div>
      </div>,
      this.elBodyContainer,
    );
  };

  render() {
    const { value } = this.props;
    const { placeholder, style, className } = this.props;
    // fix:Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.Check the render method of YearPicker
    setTimeout(this.renderPanel);

    return (
      <Input
        ref={ref => (this.refInput = ref)}
        readOnly
        value={value}
        suffix={<Icon type="calendar" />}
        onFocus={this.handleInputFocus}
        style={style}
        className={className}
        placeholder={placeholder}
      />
    );
  }
}

export default YearPicker;
