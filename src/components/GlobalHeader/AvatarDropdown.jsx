import { Avatar, Icon, Menu, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;
    if (key === 'logout') {
      const { dispatch } = this.props;

      if (dispatch) {
        dispatch({
          type: 'user/logout',
        });
      }
      return;
    }
  };

  render() {
    const {
      user: { currentUser },
    } = this.props;
    // <Menu.Item key="center">
    //   <Icon type="user"/>
    //   <FormattedMessage id="menu.account.center" defaultMessage="account center"/>
    //   </Menu.Item>
    // <Menu.Item key="settings">
    //   <Icon type="setting"/>
    //   <FormattedMessage id="menu.account.settings" defaultMessage="account settings"/>
    // </Menu.Item>
    // <Menu.Divider/>
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.userName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentUser.logo} alt="avatar" />
          <span className={styles.name}>{currentUser.userName}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    );
  }
}

export default connect(({ user }) => ({ user }))(AvatarDropdown);
