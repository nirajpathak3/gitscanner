import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Set your GraphQL endpoint URL here
});

const aplClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default aplClient;
