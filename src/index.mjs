import { ApolloServer } from 'apollo-server';
import { typeDefs } from "./graphql/schema.mjs";
import { resolvers } from "./graphql/resolvers.mjs";
import dotenv from 'dotenv';

dotenv.config();

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server is running .. at ${url}`);
});
