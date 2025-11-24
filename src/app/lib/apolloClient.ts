import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: '/graphql',
      fetch: (uri, options) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token && options) {
          options.headers = {
            ...options.headers,
            authorization: `Bearer ${token}`,
          };
        }
        return fetch(uri, options);
      },
    }),
    cache: new InMemoryCache(),
  });
};

const client = createApolloClient();

export default client;
