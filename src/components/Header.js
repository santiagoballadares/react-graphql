import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { AUTH_TOKEN } from '../constants';

class Header extends Component {
  logout() {
    localStorage.removeItem(AUTH_TOKEN);
    this.props.history.push('/');
  }

  render() {
    const token = localStorage.getItem(AUTH_TOKEN);

    return (
      <div className="flex pa1 justify-between nowrap orange">
        <div className="flex flex-fixed black">
          <div className="fw7 mr1">Links list</div>
          <Link to="/" className="ml1 no-underline black">
            new
          </Link>
          {token &&
            <div className="flex">
              <div className="ml1">|</div>
              <Link to="create" className="ml1 no-underline black">
                submit
              </Link>
            </div>
          }
        </div>
        <div className="flex flex-fixed">
          {token ?
            <div className="ml1 pointer black" onClick={this.logout.bind(this)}>
              logout
            </div> :
            <Link to="login" className="ml1 no-underline black">
              login
            </Link>           
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Header);