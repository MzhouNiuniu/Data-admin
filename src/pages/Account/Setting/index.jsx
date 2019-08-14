import './index.scss'
import React from 'react'
import { Row, Col, Menu, Card } from 'antd'
import ChangePwd from './ChangePwd'

const menuList = [
  {
    name: '修改密码',
    component: ChangePwd,
  },
]

class Setting extends React.Component {
  state = {
    currentMenuIndex: 0
  }

  handlerMenuChange = ({ key }) => {
    this.setState({
      currentMenuIndex: key,
    })
  }

  render() {
    const { currentMenuIndex } = this.state
    const RightContent = menuList[currentMenuIndex].component
    return (
      <div className="page__account__setting clearfix">
        <div className="left">
          <Menu mode="inline" selectedKeys={[String(currentMenuIndex)]}
                onSelect={this.handlerMenuChange}>
            {
              menuList.map((item, index) => {
                return (
                  <Menu.Item key={index}>
                    {item.name}
                  </Menu.Item>
                )
              })
            }
          </Menu>
        </div>
        <div className="right">
          <RightContent/>
        </div>
      </div>
    )
  }
}

export default Setting
