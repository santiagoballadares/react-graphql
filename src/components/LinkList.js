import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import Link from './Link';
import { FEED_QUERY } from '../graphql/queries';
import { NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from '../graphql/subscriptions';
import { LINKS_PER_PAGE } from '../constants';

class LinkList extends Component {
  getQueryVariables() {
    const { location: { pathname = '' } = {}, match: { params = {} } = {} } = this.props;
    const isNewPage = pathname.includes('new');
    const page = parseInt(params.page, 10);

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;

    return { first, skip, orderBy };
  }

  getLinksToRender(data) {
    const { location: { pathname = '' } = {} } = this.props;
    const isNewPage = pathname.includes('new');

    if (isNewPage) {
      return data.feed.links;
    }

    const rankedLinks = data.feed.links.slice();
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return rankedLinks;
  }

  previousPage() {
    const { match: { params = {} } = {} } = this.props;
    const page = parseInt(params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      this.props.history.push(`/new/${previousPage}`);
    }
  }

  nextPage(data) {
    const { match: { params = {} } = {} } = this.props;
    const page = parseInt(params.page, 10);

    if (LINKS_PER_PAGE < data.feed.count) {
      const nextPage = page + 1;
      this.props.history.push(`/new/${nextPage}`);
    }
  }

  updateCacheAfterVote(store, createVote, linkId) {
    const { location: { pathname = '' } = {}, match: { params = {} } = {} } = this.props;
    const isNewPage = pathname.includes('new');
    const page = parseInt(params.page, 10);

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? 'createdAt_DESC' : null;
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { first, skip, orderBy },
    });

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

  renderNavigation(data) {
    const { location: { pathname = '' } = {} } = this.props;
    const isNewPage = pathname.includes('new');

    if (!isNewPage) {
      return null;
    }

    return (
      <div className="flex ml4 mv3 gray">
        <div className="pointer mr2" onClick={this.previousPage.bind(this)}>
          Previous
        </div>
        <div className="pointer" onClick={() => this.nextPage(data)}>
          Next
        </div>
      </div>
    );
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

    const { match: { params: { page } = {} } = {} } = this.props;
    const linksToRender = this.getLinksToRender(data);
    const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

    return (
      <Fragment>
        {linksToRender.map((link, index) => (
          <Link
            key={link.id}
            index={index + pageIndex}
            link={link}
            updateStoreAfterVote={this.updateCacheAfterVote}
          />
        ))}
        {this.renderNavigation(data)}
      </Fragment>
    );
  }

  render() {
    return (
      <Query query={FEED_QUERY} variables={this.getQueryVariables()}>
        {payload => this.renderData(payload)}
      </Query>
    );
  }
}

export default LinkList;
