import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Link from './Link';
import { FEED_QUERY } from '../graphql/queries';

class LinkList extends Component {
  updateCacheAfterVote(store, createVote, linkId) {
    const data = store.readQuery({ query: FEED_QUERY });
    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;
    store.writequery({ query: FEED_QUERY, data });
  }

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
        {linksToRender.map((link, index) => (
          <Link
            key={link.id}
            index={index}
            link={link}
            updateStoreAfterVote={this.updateCacheAfterVote}
          />
        ))}
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
