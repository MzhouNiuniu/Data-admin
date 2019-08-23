import React from 'react';

const { Provider, Consumer } = React.createContext({
  disabled: false,
});

class Consumer2 extends React.PureComponent {
  render() {
    const props = { ...this.props };
    const { children } = props;
    delete props.children;
    return <Consumer>{value => children(value, props)}</Consumer>;
  }
}

function Fieldset(props) {
  return (
    <Provider
      value={{
        disabled: props.disabled,
      }}
    >
      {props.children}
    </Provider>
  );
}

Fieldset.Field = function(element) {
  return (
    <Consumer2>
      {(value, props) => {
        return React.cloneElement(element, {
          ...props,
          disabled: value.disabled,
        });
      }}
    </Consumer2>
  );
};
export default Fieldset;
