import './index.scss';
import React from 'react';
import propTypes from 'prop-types';

const CONTEXT_MENU_CLASSNAME = 'component__context-menu__menu';

class ContextMenu extends React.PureComponent {
  static propTypes = {
    menu: propTypes.any.isRequired, // 右键菜单的内容
  };
  root = null; // element
  state = {
    visible: false,
    x: 0,
    y: 0,
  };

  closeMenu = e => {
    // if (this.checkTargetIsMenu(e)) {
    //   e.preventDefault()
    //   window.addEventListener('click', this.closeMenu, {
    //     once: true,
    //   })
    //   return
    // }
    this.setState({
      visible: false,
    });
  };

  checkTargetIsMenu = e => {
    const path = e.composedPath();
    for (let i = 0; i < path.length; i++) {
      if (path[i] === document.body) {
        return false;
      }
      if (path[i].classList.contains(CONTEXT_MENU_CLASSNAME)) {
        return true;
      }
    }
    return false;
  };

  handleMousedown = e => {
    e.preventDefault();
    if (this.checkTargetIsMenu(e)) {
      return;
    }
    this.setState({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
    window.addEventListener('click', this.closeMenu, {
      once: true,
    });
  };

  componentDidMount() {
    this.root.addEventListener('contextmenu', this.handleMousedown);
  }

  componentWillUnmount() {
    this.root.removeEventListener('contextmenu', this.handleMousedown);
  }

  renderMenu = () => {
    const { x, y } = this.state;
    return (
      <section
        className={CONTEXT_MENU_CLASSNAME}
        style={{
          top: y + 'px',
          left: x + 'px',
        }}
      >
        {this.props.menu}
      </section>
    );
  };

  render() {
    return (
      <section ref={ref => (this.root = ref)}>
        {this.props.children}
        {this.state.visible && this.renderMenu()}
      </section>
    );
  }
}

export default ContextMenu;
