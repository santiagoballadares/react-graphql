import React, { Component } from 'react'
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

export class CreateLink extends Component {
  state = {
    url: '',
    description: '',
  };

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
            onChange= {this.onChangeUrl.bind(this)}
          />
          <input
            type="text"
            className="mb2"
            placeholder="A description for the link"
            value={description}
            onChange= {this.onChangeDescription.bind(this)}
          />
        </div>
        <Mutation 
          mutation={POST_MUTATION}
          variables={{ url, description }}
          onCompleted={() => this.props.history.push('/')}
        >
          {postMutation => <button onClick={postMutation}>Submit</button>}
        </Mutation>
      </div>
    );
  }
}

export default CreateLink;
