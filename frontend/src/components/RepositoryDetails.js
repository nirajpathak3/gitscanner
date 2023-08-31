import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORY_DETAILS } from '../queries';
import { useLocation, Link } from 'react-router-dom';

function RepositoryDetails() {

    const location = useLocation();
    const routeName = location?.pathname.split('/');

    const { loading, error, data } = useQuery(GET_REPOSITORY_DETAILS, {
        variables: { owner: routeName[2], name: routeName[3] },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { repositoryDetails } = data;

    return (
        <div className="repository-detail">
            <p><Link to={`/`} > Back</Link></p>
            <h2>Repository Details</h2>
            <p>Name: {repositoryDetails.name}</p>
            <p>Owner: {repositoryDetails.owner}</p>
            <p>Size: {repositoryDetails.size}</p>
            <p>Is Private: {repositoryDetails.isPrivate ? 'Yes' : 'No'}</p>
            <p>Number of Files: {repositoryDetails.numFiles}</p>
            <p>Active Webhooks: {repositoryDetails.activeWebhooks}</p>
            <p>YAML Content:</p>
            <code>{repositoryDetails.ymlContent}</code>
        </div>
    );
}

export default RepositoryDetails;