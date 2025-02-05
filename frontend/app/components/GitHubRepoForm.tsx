'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  username: string;
}

export function GitHubRepoForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState<any[]>([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${data.username}/repos`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setRepos(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            GitHub Username
          </label>
          <input
            {...register('username', { required: 'Username is required' })}
            id="username"
            type="text"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            placeholder="Enter GitHub username"
            aria-describedby="username-error"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600" id="username-error">
              {errors.username.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          aria-label="Search repositories"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="rounded-md bg-red-50 p-4" role="alert">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Repositories</h2>
          <ul className="space-y-4">
            {repos.map((repo) => (
              <li 
                key={repo.id} 
                className="bg-white shadow rounded-lg p-4"
              >
                <h3 className="text-lg font-medium">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-500"
                    aria-label={`Open ${repo.name} repository`}
                  >
                    {repo.name}
                  </a>
                </h3>
                {repo.description && (
                  <p className="mt-1 text-gray-500">{repo.description}</p>
                )}
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                  <span>{repo.language || 'No language specified'}</span>
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🔄 {repo.forks_count}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
