import gql from 'graphql-tag';

export const FEED_QUERY = gql`
{
  feed {
    links {
      id
      createdAt
      url
      description
      votes {
        id
        user {
          id
        }
      }
      postedBy {
        id
        name
      }
    }
  }
}
`;
