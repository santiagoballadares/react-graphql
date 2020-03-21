import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { timeDifferenceForDate } from '../utils';
import { Mutation } from 'react-apollo';
import { VOTE_MUTATION } from '../graphql/mutations';
import { AUTH_TOKEN } from '../constants';

class Link extends Component {
  constructor(props) {
    super(props);
    this.handleVoteUpdate = this.handleVoteUpdate.bind(this);
  }

  handleVoteUpdate(store, { data: { vote } }) {
    const { link: { id } = {} } = this.props;
    this.props.updateStoreAfterVote(store, vote, id);
  }

  getVotesInfo() {
    const { link: { votes = [], postedBy, createdAt } = {} } = this.props;
    const author = postedBy ? postedBy.name : 'Unknown';
    return `${votes.length} votes | by ${author} ${timeDifferenceForDate(createdAt)}`;
  }

  renderUpvoteButton() {
    const token = localStorage.getItem(AUTH_TOKEN);

    if (!token) {
      return null;
    }

    const { link: { id } = {} } = this.props;

    return (
      <Mutation mutation={VOTE_MUTATION} variables={{ linkId: id }} update={this.handleVoteUpdate}>
        {voteMutation => (
          <div className="ml1 gray f11 clickable" onClick={voteMutation} title="Vote">
            ▲
          </div>
        )}
      </Mutation>
    );
  }

  render() {
    const { index, link: { url, description } = {} } = this.props;

    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{index + 1}</span>
          {this.renderUpvoteButton()}
        </div>
        <div className="ml1">
          <div>
            {description} ({url})
          </div>
          <div className="f6 lh-copy gray">{this.getVotesInfo()}</div>
        </div>
      </div>
    );
  }
}

Link.propTypes = {
  index: PropTypes.number,
  link: PropTypes.object,
  updateStoreAfterVote: PropTypes.func,
};

export default Link;
