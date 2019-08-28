import React from 'react';
import propTypes from 'prop-types';
import { Button, message, Popconfirm } from 'antd';
import request from '@/utils/request';

StickButton.propTypes = {
  api: propTypes.string.isRequired,
  row: propTypes.object.isRequired,
  status: propTypes.oneOfType([propTypes.string.isRequired, propTypes.number.isRequired]),
  finallyCallback: propTypes.func,
};

function onConfirm(props, status) {
  const { api, row, finallyCallback } = props;
  request(api, {
    method: 'post',
    data: {
      id: row._id,
      stick: status,
    },
  }).then(res => {
    if (res.status !== 200) {
      message.warn(res.message);
      return;
    }
    message.success(res.message);
    finallyCallback && finallyCallback();
  });
}

function StickButton(props) {
  const status = Number(props.status);
  return (
    <>
      {status === 0 ? (
        <Popconfirm
          placement="topLeft"
          title="确定置顶吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={() => onConfirm(props, 1)}
        >
          <Button type="dashed">置顶</Button>
        </Popconfirm>
      ) : (
        <Popconfirm
          placement="topLeft"
          title="确定取消置顶吗？"
          okText="确定"
          cancelText="取消"
          onConfirm={() => onConfirm(props, 0)}
        >
          <Button type="dashed">取消置顶</Button>
        </Popconfirm>
      )}
      <span>&emsp;</span>
    </>
  );
}

export default StickButton;
