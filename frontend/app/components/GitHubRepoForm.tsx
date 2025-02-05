'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pagination } from './Pagination';

interface FormData {
  username: string;
}

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

interface RepositoryResponse {
  items: Repository[];
  total: number;
}

const PER_PAGE = 10;

export function GitHubRepoForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRepos, setTotalRepos] = useState(0);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const fetchRepositories = async (username: string, page: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${username}/repos?page=${page}&per_page=${PER_PAGE}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Убедимся, что у нас есть данные и они в правильном формате
      const repoData = result.data as RepositoryResponse;
      setRepos(repoData.items || []);
      setTotalRepos(repoData.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
      // Очищаем репозитории при ошибке
      setRepos([]);
      setTotalRepos(0);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setCurrentPage(1);
    await fetchRepositories(data.username, 1);
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    const formData = new FormData(document.querySelector('form') as HTMLFormElement);
    const username = formData.get('username') as string;
    await fetchRepositories(username, page);
  };

  const totalPages = Math.ceil(totalRepos / PER_PAGE);

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-medium text-gray-200 mb-2"
          >
            GitHub Username
          </label>
          <input
            {...register('username', { required: 'Username is required' })}
            id="username"
            type="text"
            className="block w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter GitHub username (e.g., octocat)"
            aria-describedby="username-error"
          />
          {errors.username && (
            <p className="mt-2 text-sm text-red-400" id="username-error">
              {errors.username.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4 py-3 text-sm font-medium text-white shadow-lg hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200"
          aria-label="Search repositories"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </span>
          ) : 'Search Repositories'}
        </button>
      </form>

      {error && (
        <div className="rounded-lg bg-red-900/50 border border-red-500 p-4" role="alert">
          <div className="text-sm text-red-400">{error}</div>
        </div>
      )}

      {repos.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-medium text-white mb-4">
            Repositories ({totalRepos} total)
          </h2>
          <ul className="space-y-4">
            {repos.map((repo) => (
              <li 
                key={repo.id} 
                className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/50 transition-colors duration-200"
              >
                <h3 className="text-lg font-medium">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300"
                    aria-label={`Open ${repo.name} repository`}
                  >
                    {repo.name}
                  </a>
                </h3>
                {repo.description && (
                  <p className="mt-1 text-gray-300">{repo.description}</p>
                )}
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-400">
                  <span>{repo.language || 'No language specified'}</span>
                  <span title="Stars">⭐ {repo.stargazers_count}</span>
                  <span title="Forks">🔄 {repo.forks_count}</span>
                </div>
              </li>
            ))}
          </ul>
          
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
