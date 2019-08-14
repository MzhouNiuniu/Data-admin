import './index.scss'
import React from 'react'
import LoginForm from './LoginForm'
import RegForm from './RegForm'


export default class Login extends React.Component {
  state = {
    isLoginMode: true,
  }

  changeState = state => {
    this.setState(state)
  }

  render() {
    const { isLoginMode } = this.state
    return (
      <section className="login-page">
        {
          isLoginMode
            ? <LoginForm changeState={this.changeState}/>
            : <RegForm changeState={this.changeState}/>
        }
      </section>
    )
  }
}
