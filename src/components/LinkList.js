import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Link from './Link';

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

class LinkList extends Component {
  renderData({ loading, error, data }) {
    if (loading) {
      return <div>Fetching data...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    const linksToRender = data.feed.links;

    return (
      <div>
        {linksToRender.map(link => <Link key={link.id} link={link} />)}
      </div>
    );
  }

  render() {
    return (
      <Query query={FEED_QUERY}>
        {(payload) => this.renderData(payload)}
      </Query>
    )
  }
}

export default LinkList;
