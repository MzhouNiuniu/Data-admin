import { Icon, Menu } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import React from 'react';
import classNames from 'classnames';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const SelectLang = props => {
  const { global, className } = props;
  const selectedLang = global.language;
  const changeLang = ({ key }) => {
    props.dispatch({
      type: 'global/changeLang',
      payload: key,
    });
  };

  const locales = ['zh-CN', 'en-US'];
  const languageLabels = {
    'zh-CN': '简体中文',
    'en-US': 'English',
  };
  const languageIcons = {
    'zh-CN': '🇨🇳',
    'en-US': '🇬🇧',
  };
  const langMenu = (
    <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={changeLang}>
      {locales.map(locale => (
        <Menu.Item key={locale}>
          <span role="img" aria-label={languageLabels[locale]}>
            {languageIcons[locale]}
          </span>{' '}
          {languageLabels[locale]}
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    <HeaderDropdown overlay={langMenu} placement="bottomRight">
      <span className={classNames(styles.dropDown, className)}>
        <Icon
          type="global"
          title={formatMessage({
            id: 'navBar.lang',
          })}
        />
      </span>
    </HeaderDropdown>
  );
};

export default connect(({ global }) => ({ global }))(SelectLang);
