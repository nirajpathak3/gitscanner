import { getRepositories, getRepositoryDetails } from "../controllers/repositoryController.mjs";

const resolvers = {
    Query: {
        repositories: () => getRepositories(),
        repositoryDetails: (_, { owner, name }) => getRepositoryDetails(owner, name),
    },
};

export { resolvers };