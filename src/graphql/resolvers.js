import { getRepositories, getRepositoryDetails } from '../controllers/repositoryController';

export const resolvers = {
  Query: {
    repositories: () => getRepositories(),
    repositoryDetails: (_, { owner, name }) => getRepositoryDetails(owner, name),
  },
};
