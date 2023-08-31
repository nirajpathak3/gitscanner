import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORIES } from '../queries';
import { Link } from 'react-router-dom';

function RepositoryList() {
    const { loading, error, data } = useQuery(GET_REPOSITORIES);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { repositories } = data;

    return (
        <div>
            <h2>Repository List</h2>
            <ul className="repository-list">
                {repositories.map((repo) => (
                    <li key={repo.name} className="repository-item">
                        <p>Name:<Link to={`/repository/${repo.owner}/${repo.name}`} >{repo.name}</Link>
                        </p>
                        <p>Owner: {repo.owner}</p>
                        <p>Size: {repo.size}</p>
                        <p>Is Private: {repo.isPrivate ? 'Yes' : 'No'}</p>
                    </li>
                ))}
            </ul>
        </div>
    );

}

export default RepositoryList;
