import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: '/graphql',
      credentials: 'include', // Send cookies with requests
      fetch: (uri, options) => {
        return fetch(uri, options);
      },
    }),
    cache: new InMemoryCache(),
  });
};

const client = createApolloClient();

export default client;
