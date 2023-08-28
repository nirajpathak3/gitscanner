import { ApolloServer, gql } from 'apollo-server';
import axios from 'axios';
import pLimit from 'p-limit';
import dotenv from 'dotenv';
dotenv.config();

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
                const response = await axios.get('https://api.github.com/user/repos', {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    },
                });

                const repositories = await Promise.all(
                    response.data.map(repo => {
                        return limit(() => ({
                            name: repo.name,
                            size: repo.size,
                            owner: repo.owner.login,
                            isPrivate: repo.private,
                        }));
                    })
                );

                return repositories;
            } catch (error) {
                throw new Error('Failed to fetch repositories from GitHub API');
            }
        },
        repositoryDetails: async (_, { owner, name }) => {
            try {
                const response = await axios.get(`https://api.github.com/repos/${owner}/${name}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    },
                });

                const repo = response.data;

                // Function to recursively scan for YAML files
                const scanForYamlFiles = async (path) => {
                    const filesResponse = await axios.get(`https://api.github.com/repos/${owner}/${name}/contents/${path}`, {
                        headers: {
                            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                        },
                    });

                    const numFiles = filesResponse.data.length;
                    let ymlContent = '';

                    for (const file of filesResponse.data) {
                        if (file.type === 'file' && file.name.endsWith('.yml')) {
                            // Fetch content of the YAML file
                            const contentResponse = await axios.get(file.download_url);
                            ymlContent = contentResponse.data;
                            break;
                        } else if (file.type === 'dir') {
                            // Recursively scan subdirectory
                            const subdirectoryPath = `${path}/${file.name}`;
                            const subdirectoryYamlContent = await scanForYamlFiles(subdirectoryPath);
                            if (subdirectoryYamlContent) {
                                ymlContent = subdirectoryYamlContent;
                                break;
                            }
                        }
                    }

                    return ymlContent;
                };

                // Start scanning from the root directory
                const ymlContent = await scanForYamlFiles('');
                

                // Fetch number of files
                const filesResponse = await axios.get(`https://api.github.com/repos/${owner}/${name}/contents`, {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    },
                });

                const numFiles = filesResponse.data.length;

                // Fetch active webhooks
                const webhooksResponse = await axios.get(`https://api.github.com/repos/${owner}/${name}/hooks`, {
                    headers: {
                        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
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
