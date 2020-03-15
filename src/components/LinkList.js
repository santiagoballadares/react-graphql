import React, { Component } from 'react';
import { Query } from 'react-apollo';
import Link from './Link';
import { FEED_QUERY } from '../graphql/queries';
import { NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from '../graphql/subscriptions';

class LinkList extends Component {
  updateCacheAfterVote(store, createVote, linkId) {
    const data = store.readQuery({ query: FEED_QUERY });
    const votedLink = data.feed.links.find(link => link.id === linkId);
    votedLink.votes = createVote.link.votes;
    store.writequery({ query: FEED_QUERY, data });
  }

  async subscribeToNewLinks(subscribeToMore) {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }
        const newLink = subscriptionData.data.newLink;
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);
        if (exists) {
          return prev;
        }
        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename,
          },
        });
      },
    });
  }

  subscribeToNewVotes(subscribeToMore) {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION,
    });
  }

  renderData({ loading, error, data, subscribeToMore }) {
    if (loading) {
      return <div>Fetching data...</div>;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    this.subscribeToNewLinks(subscribeToMore);
    this.subscribeToNewVotes(subscribeToMore);

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
    return <Query query={FEED_QUERY}>{payload => this.renderData(payload)}</Query>;
  }
}

export default LinkList;
