import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '../graphql/mutations';
import { AUTH_TOKEN } from '../constants';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true,
      name: '',
      email: '',
      password: '',
      error: '',
    };
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onToggleLogin = this.onToggleLogin.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  onChangeName(event) {
    this.setState({ name: event.target.value });
  }

  onChangeEmail(event) {
    this.setState({ email: event.target.value });
  }

  onChangePassword(event) {
    this.setState({ password: event.target.value });
  }

  onToggleLogin() {
    this.setState(prevState => ({
      ...prevState,
      name: '',
      email: '',
      password: '',
      login: !prevState.login,
    }));
  }

  async saveUserData(token) {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  async handleConfirm(data) {
    const { login } = this.state;
    const { token } = login ? data.login : data.signup;
    this.saveUserData(token);
    this.props.history.push('/');
  }

  async handleError(error) {
    this.setState({ error: error.message });
  }

  renderInputFields() {
    const { login, name, email, password } = this.state;
    let nameInputField = null;

    if (!login) {
      nameInputField = (
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={this.onChangeName}
        />
      );
    }

    return (
      <div className="flex flex-column">
        {nameInputField}
        <input
          type="text"
          placeholder="Your email address"
          value={email}
          onChange={this.onChangeEmail}
        />
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={this.onChangePassword}
        />
      </div>
    );
  }

  renderButtons() {
    const { login, name, email, password } = this.state;

    return (
      <div className="flex mt3">
        <Mutation
          mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={{ name, email, password }}
          onCompleted={this.handleConfirm}
          onError={this.handleError}
        >
        {
          mutation => (
            <div className="pointer mr2 button" onClick={mutation}>
              {login ? 'login' : 'create account'}
            </div>
          )
        }
        </Mutation>
        <div className="pointer button" onClick={this.onToggleLogin}>
          {login ? 'need to create an account?' : 'already have an account?'}
        </div>
      </div>
    );
  }

  renderError() {
    const { error } = this.state;

    if (!error) {
      return null;
    }

    return <h5 className="mv3 red">{error}</h5>;
  }

  render() {
    const { login } = this.state;

    return (
      <div>
        <h4 className="mv3">
          {login ? 'Login' : 'Sign Up'}
        </h4>
        {this.renderInputFields()}
        {this.renderButtons()}
        {this.renderError()}
      </div>
    );
  }
}

export default Login;
