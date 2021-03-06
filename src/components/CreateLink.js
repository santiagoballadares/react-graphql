import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { POST_MUTATION } from '../graphql/mutations';
import { FEED_QUERY } from '../graphql/queries';
import { LINKS_PER_PAGE } from '../constants';

export class CreateLink extends Component {
  state = {
    url: '',
    description: '',
  };

  handleCreateLinkUpdate(store, { data: { post } }) {
    const skip = 0;
    const first = LINKS_PER_PAGE;
    const orderBy = 'createdAt_DESC';
    const data = store.readQuery({
      query: FEED_QUERY,
      variables: { skip, first, orderBy },
    });
    data.feed.links.unshift(post);
    store.writeQuery({
      query: FEED_QUERY,
      data,
      variables: { skip, first, orderBy },
    });
  }

  onChangeUrl(event) {
    this.setState({ url: event.target.value });
  }

  onChangeDescription(event) {
    this.setState({ description: event.target.value });
  }

  render() {
    const { url, description } = this.state;

    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            type="text"
            className="mb2"
            placeholder="The URL for the link"
            value={url}
            onChange={this.onChangeUrl.bind(this)}
          />
          <input
            type="text"
            className="mb2"
            placeholder="A description for the link"
            value={description}
            onChange={this.onChangeDescription.bind(this)}
          />
        </div>
        <Mutation
          mutation={POST_MUTATION}
          variables={{ url, description }}
          onCompleted={() => this.props.history.push('/new/1')}
          update={this.handleCreateLinkUpdate}
        >
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation>
      </div>
    );
  }
}

export default CreateLink;
