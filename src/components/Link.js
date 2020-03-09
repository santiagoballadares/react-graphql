import React, { Component } from 'react';

class Link extends Component {
  render() {
    const { link: { description, url } = {} } = this.props;
    return (
      <div>
        <div>
          {description} ({url})
        </div>
      </div>
    );
  }
}

export default Link;
