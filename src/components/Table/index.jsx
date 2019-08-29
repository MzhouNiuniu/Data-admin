import React from 'react';
import { Table, Button } from 'antd';
import propTypes from 'prop-types';



class ProTable extends React.Component {

  static propTypes = {
    columns: propTypes.array,
    data: propTypes.array,
    onSelectChange: propTypes.func,
    pagination: propTypes.object
  };
  static defaultProps = {
    columns: [],
    data: [],
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log(selectedRows);
    },
    pagination: {
      defaultPageSize: 8,
      onChange(page, pageSize) {
        console.log(page,pageSize)
      }
    }
  };

  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
  };
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.onSelectChange(selectedRowKeys, selectedRows);
    this.setState({ selectedRowKeys });
  };
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <Table rowSelection={rowSelection} bordered columns={this.props.columns} dataSource={this.props.data} pagination={this.props.pagination}/>
      </div>
    );
  }
}

export default ProTable