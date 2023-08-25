import { ApolloServer, gql } from 'apollo-server';
import axios from 'axios';
import pLimit from 'p-limit';

// Replace with your GitHub personal access token
const GITHUB_TOKEN = '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';

const typeDefs = gql`
  type Repository {
    name: String
    size: Int
    owner: String
    isPrivate: Boolean
    numFiles: Int
    ymlContent: String
    activeWebhooks: Int
  }

  type Query {
    repositories: [Repository]
    repositoryDetails(owner: String!, name: String!): Repository
  }
`;

const limit = pLimit(2);

const resolvers = {
    Query: {
        repositories: async () => {
            try {               
                const responses = await Promise.all([
                    limit(() => axios.get('https://api.github.com/repos/nirajpathak3/repoA', {
                        headers: {
                            Authorization: `Bearer ${GITHUB_TOKEN}`,
                        },
                    })),
                    limit(() => axios.get('https://api.github.com/repos/nirajpathak3/repoB', {
                        headers: {
                            Authorization: `Bearer ${GITHUB_TOKEN}`,
                        },
                    })),
                    limit(() => axios.get('https://api.github.com/repos/nirajpathak3/repoC', {
                        headers: {
                            Authorization: `Bearer ${GITHUB_TOKEN}`,
                        },
                    })),
                ]);

                console.log(responses);

                const repositories = responses.map(repo => ({
                    name: repo.data.name,
                    size: repo.data.size,
                    owner: repo.data.owner.login,
                    isPrivate: repo.data.private,
                }));

                return repositories;
            } catch (error) {
                throw new Error('Failed to fetch repositories from GitHub API');
            }
        },
        repositoryDetails: async (_, { owner, name }) => {
            try {
                const response = await axios.get(`https://api.github.com/repos/${owner}/${name}`, {
                    headers: {
                        Authorization: `Bearer ${GITHUB_TOKEN}`,
                    },
                });

                const repo = response.data;

                const filesResponse = await axios.get(`https://api.github.com/repos/${owner}/${name}/contents`, {
                    headers: {
                        Authorization: `Bearer ${GITHUB_TOKEN}`,
                    },
                });

                const numFiles = filesResponse.data.length;

                let ymlContent = '';
                for (const file of filesResponse.data) {
                    if (file.name.endsWith('.yml')) {
                        const contentResponse = await axios.get(file.download_url);
                        ymlContent = contentResponse.data;
                        break;
                    }
                }

                const webhooksResponse = await axios.get(`https://api.github.com/repos/${owner}/${name}/hooks`, {
                    headers: {
                        Authorization: `Bearer ${GITHUB_TOKEN}`,
                    },
                });

                const activeWebhooks = webhooksResponse.data.length;

                return {
                    name: repo.name,
                    size: repo.size,
                    owner: repo.owner.login,
                    isPrivate: repo.private,
                    numFiles,
                    ymlContent,
                    activeWebhooks,
                };
            } catch (error) {
                throw new Error('Failed to fetch repository details from GitHub API');
            }
        },
    },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.log(`Server is running at ${url}`);
});
