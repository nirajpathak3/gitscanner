import { gql } from '@apollo/client';

export const GET_REPOSITORY_DETAILS = gql`
  query GetRepositoryDetails($owner: String!, $name: String!) {
    repositoryDetails(owner: $owner, name: $name) {
      activeWebhooks
      ymlContent
      size
      isPrivate
      name
      numFiles
      owner
    }
  }
`;

export const GET_REPOSITORIES = gql`
  query GetRepositories {
    repositories {
      name
      owner
      size
      isPrivate
    }
  }
`;
