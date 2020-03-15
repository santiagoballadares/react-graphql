import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { FEED_SEARCH_QUERY } from '../graphql/queries';
import Link from './Link';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      links: [],
      filter: '',
      loading: false,
    };
    this.onChangeInput = this.onChangeInput.bind(this);
    this.search = this.search.bind(this);
  }

  onChangeInput(event) {
    this.setState({ filter: event.target.value });
  }

  async search() {
    const { filter } = this.state;

    this.setState({ loading: true });

    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter },
    });
    const links = result.data.feed.links;

    this.setState({ links, loading: false });
  }

  renderLinks() {
    const { links, loading } = this.state;

    if (loading) {
      return <div>Searching...</div>;
    }

    return links.map((link, index) => <Link key={link.id} index={index} link={link} />);
  }

  render() {
    return (
      <div>
        <div>
          <input type="text" onChange={this.onChangeInput} />
          <button className="ml1" onClick={this.search}>
            search
          </button>
        </div>
        {this.renderLinks()}
      </div>
    );
  }
}

export default withApollo(Search);
